import React, { Component } from 'react';
import { connect } from 'unistore/react';
import styled from 'styled-components';
import { styled as styledUi, withStyles } from '@material-ui/core/styles';

import { getTargetGroupType, targetGroups } from '~/state/dataUtils';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TargetGroupTags from '~/components/TargetGroupTags'

import Actions from '~/state/Actions';

const TargetGroupFilterWrapper = styled.div`
  margin-left: ${props => props.theme.margin[0]};
  opacity: ${p => p.active === 'target' ? 1 : .5};
`;

const StyledFormGroup = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
})(FormGroup)

const StyledCheckbox = withStyles({
  root: {
    color: 'black',
  },
  checked: {
    color: '#1f1f1f'
  },
})(Checkbox);

const StyledFormControlLabel = withStyles({
  label: {
    fontSize: '13px',
    fontFamily: 'Clan Book'
  },
})(FormControlLabel);



class CategoryFilter extends Component {
  constructor(props) {
    super(props);
  }

  onChange(type) {
    const { setActiveFilter } = this.props;
    this.props.toggleTargetGroupTypeFilter(type);
    setActiveFilter('target');
  }

  render() {
    const { targetGroupTypes, filter, activeFilter, setActiveFilter } = this.props
    return (
      <StyledFormGroup aria-label="position" row>
      { targetGroupTypes.map((type,i) => {
        return (
          <TargetGroupFilterWrapper active={activeFilter} key={`TargetGroupFilter__${i}__${type}`}>
            <StyledFormControlLabel
              value={type}
              checked={filter.targetGroupFilter.includes(type)}
              onClick={() => {this.onChange(type)}}
              control={<StyledCheckbox color="default"/>}
              label={getTargetGroupType(type)}
              labelPlacement="end"
            />
            { filter.targetGroupFilter.includes(type) &&
              <TargetGroupTags
                targetGroups={ targetGroups[type] }
                key={`TargetGroupsTags__${i}__${type}`}
                targetGroupType={type}
              />
            }
          </TargetGroupFilterWrapper>
        )
      }) }
      </StyledFormGroup>
    )
  }
}

export default connect(state => ({
  targetGroupTypes: state.targetGroupTypes,
  filter: state.filter,
  activeFilter: state.activeFilter,
}), Actions)(CategoryFilter);