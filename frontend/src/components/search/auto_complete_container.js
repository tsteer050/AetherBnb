import { connect } from 'react-redux';
import AutoComplete from './auto_complete';
import { fetchSpots } from './../../actions/spots_actions';
import { receiveSearchStatus, receiveLocation, receiveMapIsActive } from './../../actions/search_actions';

const mapStateToProps = state => {
  return {
  activeSearch: state.ui.activeSearch
}};

const mapDispatchToProps = dispatch => ({
  fetchSpots: (options) => dispatch(fetchSpots(options)),
  receiveSearchStatus: (active) => dispatch(receiveSearchStatus(active)),
  receiveLocation: (location) => dispatch(receiveLocation(location)),
  receiveMapIsActive: (mapIsActive) => dispatch(receiveMapIsActive(mapIsActive))
});

export default connect(mapStateToProps, mapDispatchToProps)(AutoComplete);