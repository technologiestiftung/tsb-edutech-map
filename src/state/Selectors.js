import { createSelector } from 'reselect';
import { cloneDeep } from 'lodash';

import {
  filterCategories,
  getSubCategoryLabel,
  filterSubCategories,
  subCategories,
  targetGroupTypes,
  targetGroups,
  filterTargetGroupTypes,
  filterTargetGroupTags,
  sortData,
  subCategoriesEmpty,
  objectSize
} from './dataUtils';

const dataSelector = state => state.data;
const detailDataSelector = state => state.detailData;
const favsSelector = state => state.favs;
const filterSelector = state => state.filter;
const listSortingSelector = state => state.listSorting;
const colorizerSelector = state => state.colorizer;
const subCategoryListSelector = state => state.subCategoryList;
const categoriesSelector = state => state.categories;
const colorizerLightSelector = state => state.colorizerLight;

const geojsonToArray = geojson => geojson.features.map(d => d.properties);

import { filterSection } from './Store';

export const dataAsArraySelector = createSelector(
  [dataSelector],
  (data) => {
    if (!data) {
      return [];
    }
    return geojsonToArray(data);
  }
);

export const initialFilterSelector = createSelector(
  [filterSelector],
  (filter) => {
    return Object.assign({}, {
    categoryFilter: [],
    subCategoryFilter: cloneDeep(subCategoriesEmpty),
    targetGroupFilter: cloneDeep(targetGroupTypes),
    targetGroupTagsFilter: cloneDeep(targetGroups)
  })
  }
);

export const unfilteredFilterSelector = createSelector(
  [categoriesSelector, filterSelector],
  (categories, filter) => {
    return Object.assign({}, {
    categoryFilter: cloneDeep(categories),
    subCategoryFilter: cloneDeep(subCategories),
    targetGroupFilter: cloneDeep(targetGroupTypes),
    targetGroupTagsFilter: cloneDeep(targetGroups)
  })
  }
);

export const tagsCountSelector = createSelector(
  [dataSelector],
  (data) => {
    if (data) {
      const features = data.features;
      const obj = {};
      features.map(feat => {
        const { properties } = feat;
        const { subCategoriesSelected, category, name } = properties;

        subCategoriesSelected.forEach(item => {
          if (subCategories[category].includes(item)) {
            !obj[item] ? obj[item] = 1 : obj[item] += 1
          }
        })
      })
      return obj
    } else {
      return false;
    }
  }
)

export const enrichedDataSelector = createSelector(
  [
    dataSelector,
    favsSelector,
    filterSelector,
    colorizerSelector,
    colorizerLightSelector,
  ],
  (
    data,
    favs,
    filter,
    colorizer,
    colorizerLight
  ) => {
    if (data) {
      const features = data.features
        .map((feat) => {
          const { properties } = feat;
          feat.properties = properties;
          console.log(properties);
          properties.nameStr = properties.name.replace(' ', '').replace('-', '')
          properties.categoryFilter = filterCategories(properties, filter.categoryFilter);
          properties.subCategoryFilter = filterSubCategories(properties, filter.subCategoryFilter);
          properties.targetGroupTypesFilter = filterTargetGroupTypes(properties, filter.targetGroupFilter)
          properties.targetGroupTagsPrivateFilter = filterTargetGroupTags(properties, filter.targetGroupTagsFilter, 'private')
          properties.targetGroupTagsInstitutionFilter = filterTargetGroupTags(properties, filter.targetGroupTagsFilter, 'institution')
          properties.isFav = favs.includes(properties.autoid);
          properties.color = colorizer(properties.category);
          properties.colorLight = colorizerLight(properties.category);
          properties.isFiltered = false;
          return feat;
      });
      return Object.assign({}, data, { features });
    }
    }
)

export const filteredDataSelector = createSelector(
  [enrichedDataSelector],
  (data) => {
    if (data) {
      const features = data.features
        .map((feat) => {
          feat.properties.isFiltered = (
            feat.properties.categoryFilter ||
            feat.properties.subCategoryFilter ||
            feat.properties.targetGroupTypesFilter ||
            feat.properties.targetGroupTagsPrivateFilter &&
            feat.properties.targetGroupTagsInstitutionFilter
          );
          return feat;
        })
      return Object.assign({}, data, { features });
    } else {
      return {};
    }
  }
);

export const filteredListDataSelector = createSelector(
  [filteredDataSelector, listSortingSelector],
  (data, sortBy) => {
    if (!data) {
      return [];
    }

    if (objectSize(data) > 0) {

      let features = data.features.filter(feat => (
        !feat.properties.isFiltered)
      );

      features = features
        .map(feat => feat.properties)
        .sort(sortData(sortBy));

      return features;
    }
  }
);

export const targetGroupsArraySelector = createSelector(
  [detailDataSelector],
  (data) => {
    if (data) {
      const keys = ['targetgroupprivate', 'targetgroupinstituion'];
      const keysOther = ['targetgroupinstituionother', 'targetgroupprivateother'];

      let arr = keys.map(key => {
        return data[key].map(val => {
          if (val.text != 'Keine' || val.text != 'Andere') {
            return val.text
          }
        });
      })

      keysOther.forEach(key => {
        if (data[key].length > 0) {
          arr.push(data[key]);
        }
      });

      return arr.flat();
    }
  }
)

export const favoritesSelector = createSelector(
  [enrichedDataSelector],
  (data) => {
    if (data) {
      const features = data.features.filter(feat => feat.properties.isFav);
      return geojsonToArray(Object.assign({}, data, { features }));
    }
  }
);

export default {
  dataAsArraySelector,
  targetGroupsArraySelector,
  filteredListDataSelector,
  favoritesSelector,
  enrichedDataSelector,
  tagsCountSelector
};