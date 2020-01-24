import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'unistore/react';

import Actions from '~/state/Actions';
// import SidebarItemTitle from '~/modules/Sidebar/SidebarItemTitle';
import Select from '~/components/Select';

const DistrictFilterWrapper = styled.div`
  margin-bottom: ${props => props.theme.margin[2]};
  opacity: ${p => p.active === 'district' ? 1 : .5};
`;

const StyledOption = styled.option`
  font-family: 'Verdana';
  font-size: 12px;
`;

const Option = (props) => {
  const label = props.properties.alias;
  const value = props.properties.id;
  const count = props.properties.count;

  return (
    <StyledOption
      key={`DistrictOption__${value}`}
      value={value}
    >
      {label} ({count})
    </StyledOption>
  );
};

class DistrictFilter extends PureComponent {
  onChange(evt) {
    const { setActiveFilter } = this.props;
    setActiveFilter('district');
    let { value } = evt.target;
    if (evt.target.value === 'none') value = false;
    this.props.setDistrictFilter(value);
  }

  handleClick() {
    const { setActiveFilter } = this.props;
    console.log('click!!')
    setActiveFilter('district')
  }

  render() {
    const { districts, selectedDistrict, data, activeFilter, setActiveFilter } = this.props;

    if (!districts || !data) {
      return null;
    }

    const selectValue = !selectedDistrict ? 'none' : selectedDistrict;

    return (
      <DistrictFilterWrapper onClick={() => { this.handleClick() }} active={activeFilter}>
        <Select value={selectValue} onChange={evt => this.onChange(evt)}>
          <option key="DistrictOption__All" value="none">
            Alle Bezirke
          </option>
          {data.map((feat, i) => {
            return (
              <Option key={`DistrictOption__${feat.properties.alias}`} {...feat} />
            )
            })}
        </Select>
      </DistrictFilterWrapper>
    );
  }
}

export default connect(state => ({
  districts: state.additionalData.districts,
  activeFilter: state.activeFilter,
  selectedDistrict: state.filter.districtFilter,
}), Actions)(DistrictFilter);
