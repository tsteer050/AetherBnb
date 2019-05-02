import { RECEIVE_DATE_RANGE, RECEIVE_PRICE_RANGE, RECEIVE_GUEST_COUNT, RECEIVE_SEARCH_STATUS, RECEIVE_BOUNDS, RECEIVE_LOCATION } from './../actions/search_actions';
import { merge } from 'lodash';

const defaultState = { 
  active: false, 
  startDate: null,
  endDate: null,
  guestCount: {
    adults: 1,
    children: 0,
    infants: 0
  },
  priceRange: {
    minValue: 0,
    maxValue: 1000
  },
  bounds: null,
  location: null
};

//this slice of state is not persisting!

const ActiveSearchReducer = (state = defaultState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_DATE_RANGE:
      return merge({}, state, action.dateRange);
    case RECEIVE_PRICE_RANGE:
      // return merge({}, state, action.priceRange); //to remove: Valery
      return merge({}, state, { priceRange: action.priceRange });
    case RECEIVE_GUEST_COUNT:
      return merge({}, state, { guestCount: action.count });
    case RECEIVE_SEARCH_STATUS:
      return merge({}, state, { active: action.active });
    case RECEIVE_BOUNDS:
      return merge({}, state, { bounds: action.bounds });
    case RECEIVE_LOCATION:
      return merge({}, state, { location: action.location });
    default:
      return state;
  }
};

export default ActiveSearchReducer;

