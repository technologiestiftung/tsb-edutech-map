import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { NavLink, withRouter, matchPath } from 'react-router-dom';

import { withMap } from '~/modules/Map/hoc/withMap';

import Actions from '~/state/Actions';
import RoundButton from '~/components/RoundButton';
import { unfilteredFilterSelector, initialFilterSelector } from '~/state/Selectors';

import { connect } from 'unistore/react';

import config from '../../../config';

const StyledRoundButton = styled(RoundButton)`
  margin-top: 5px;
  font-weight: 700;
  font-family: ${props => props.theme.fonts.sans};
  font-size: 18px;
  line-height: 1;

  div {
    position: relative;
    top: 1px;
  }
`;

import ListIcon from '@material-ui/icons/List';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import FavIcon from '@material-ui/icons/FavoriteBorderOutlined';
import SearchIcon from '@material-ui/icons/Search';

import EdgeButton from '~/components/EdgeButton';
import { media } from '~/styles/Utils';

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-grow: 0;
  position: absolute;
  background: none;
  bottom: 55px;
  left: 15px;
  z-index: 1000;

  ${media.m`
    transform: ${props => (props.isNavOpen ? 'translate3d(375px, 0, 0)' : 'none')};
    transition: transform 500ms;
  `}
`;

const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

const UIMap = p => {

  // zoomIn() {
  //   if (this.props.map) {
  //     this.props.map.zoomIn();
  //   }
  // }

  const {
    initialFilter,
    unfiltered,
    setFilter,
    setZoom,
    setMapCenter,
    resetDetailRoute,
    setDetailData,
    setSelectedData,
    setHighlightData,
    mapCenter
  } = p;

  const zoomOut = () => {
    setZoom(config.zoom);
    setMapCenter(config.position);
  }

  const navConfig = [
    { title: 'Zoom reset', label: '-', func: () => zoomOut() },
  ];

  const handleClick = () => {
    console.log(p.state)

    // setMapCenter(config.position);
    // setZoom(config.zoom);
    // setHighlightData(false);

    // console.log(p.state)

  }

  return (
    <NavWrapper>
      {navConfig.map(m => (
        <StyledRoundButton onClick={() => { handleClick() }}></StyledRoundButton>
      ))}
    </NavWrapper>
  );

}

export default connect(state => ({
  detailData: state.detailData,
  mapCenter: state.mapCenter,
  unfiltered: unfilteredFilterSelector(state),
  initialFilter: initialFilterSelector(state),
  state: state
}), Actions)(UIMap);

// export default UIMap;
