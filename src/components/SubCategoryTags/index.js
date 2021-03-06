import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'unistore/react';

import Actions from '~/state/Actions';

import { getSubCategoryLabel } from '~/state/dataUtils';
import { tagsCountSelector } from '~/state/Selectors';

const CategoryLabelWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${ props => props.theme.margin[2]};

  &::last-of-type {
    margin-bottom: 0;
  }
`;

const CategoryLabel = styled.div`
  display: block;
  font-size: ${props => props.theme.fontSizes[0]};
  margin: 0 5px 5px 0;
  padding: 7px 10px 6px 24px;
  border-radius: 12px;
  color: ${ props => props.active ? 'white' : `${props.color}` };
  position: relative;
  line-height: 1;
  background: ${ props => props.active ? `${props.color}` : `${props.colorLight}` };
  cursor: pointer;
  transition: all .125s ease-in-out;

  &:before {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    background: ${props => props.color};
    border-radius: 100%;
    border: 2px solid ${props => props.type == 'black' ? 'black' : 'white'};
    left: ${props => (props.hasBorder ? '3px' : "7px")};
    top: ${props => (props.hasBorder ? '3px' : '6px')};
    transition: all .125s ease-in-out;
  }
`;

class SubCategoryTags extends PureComponent {

  onChange(subCat) {
    const { category, toggleSubCategoryFilter, setActiveFilter, subCategoryFilter } = this.props;
    toggleSubCategoryFilter(category, subCat);
    setActiveFilter('category');
  }

  render() {
    const {
      categories,
      colorizer,
      colorizerLight,
      type,
      className,
      activeFilter,
      setActiveFilter,
      category,
      filter,
      tagsCount,
    } = this.props;

    const { subCategoryFilter } = filter;

    return (
        <CategoryLabelWrapper className={className}>
          {categories.map(subCategory => {
            const count = tagsCount[subCategory] === undefined ? '0' : tagsCount[subCategory];
            if ( count > 0 ) {
              return (
                <CategoryLabel
                  key={`CategoryLabel__${subCategory}`}
                  color={colorizer(category)}
                  active={subCategoryFilter[category].includes(subCategory)}
                  onClick={() => this.onChange(subCategory)}
                  colorLight={colorizerLight(category)}
                >
                  { getSubCategoryLabel(category, subCategory) }
                  { tagsCount && (` (${count})`) }
                </CategoryLabel>
              )
            }
          })}
        </CategoryLabelWrapper>
    );
  }
}

export default connect(state => ({
  colorizer: state.colorizer,
  tagsCount: tagsCountSelector(state),
  colorizerLight: state.colorizerLight,
  filter: state.filter,
  activeFilter: state.activeFilter,
}), Actions)(SubCategoryTags);
