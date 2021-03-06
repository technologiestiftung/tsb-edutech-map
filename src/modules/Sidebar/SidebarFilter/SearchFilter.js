import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'unistore/react';
import Select from 'react-select';

import { dataAsArraySelector } from '~/state/Selectors';
import Actions from '~/state/Actions';

const SearchFilterWrapper = styled.div`
  margin-bottom: ${props => props.theme.margin[2]};
  font-size: ${props => props.theme.fontSizes[1]};
  padding-left: ${props => props.theme.padding[1]};
  padding-right: ${props => props.theme.margin[1]};
  font-family: ${props => props.theme.fonts.sans};

  .rs__clear-indicator {
    cursor: pointer;
  }
`;

class SearchFilter extends PureComponent {
  componentDidUpdate(prevProps) {
  }

  onChange(item) {
    this.props.setHighlightData(item);
    this.props.setDetailRoute(item ? item.autoid : false);
    this.props.setDetailRouteWithListPath(item.autoid);
    this.props.setSelectedData(true);
  }

  render() {
    return (
      <SearchFilterWrapper>
        <Select
          ref={(ref) => { this.select = ref; }}
          options={this.props.options}
          getOptionValue={option => (option.name)} // set option.standort.initialAddress here later
          getOptionLabel={option => (`${option.name} | ${option.location[0].address}`)} // set option.name here later
          onChange={item => this.onChange(item)}
          placeholder="Nach einer Einrichtung suchen..."
          classNamePrefix="rs"
          isClearable
        />
      </SearchFilterWrapper>
    );
  }
}

export default connect(state => ({
  options: dataAsArraySelector(state),
  // detailData: state.detailData
}), Actions)(SearchFilter);
