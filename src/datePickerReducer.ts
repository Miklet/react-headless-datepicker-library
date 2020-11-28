const INITIAL_STATE = {
  isOpen: false,
  selectedDate: new Date(),
  selectedDraftDateString: null as null | string,
  preselectedDate: new Date(),
};

type Actions =
  | {
      type: 'OPEN';
    }
  | { type: 'CLOSE' }
  | {
      type: 'PRESELECT_DATE';
      payload: {
        preselectedDate: Date;
      };
    }
  | { type: 'CHANGE_MONTH' };

function reducer(state: typeof INITIAL_STATE, action: Actions) {
  if (action.type === 'OPEN') {
    return {
      ...state,
      isOpen: true,
    };
  }

  if (action.type === 'CLOSE') {
    return {
      ...state,
      isOpen: false,
    };
  }

  return state;
}
