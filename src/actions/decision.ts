import { Dispatch } from "redux";

import {
  POST_DECISION_SUCCESS,
  POST_DECISION_FAILURE,
  BAD_REQUEST
} from "../consts";

import { checkApplication } from "../fakeBackend";
import { getBadRequest, getDecision } from "../api";

export const applicationSuccess = (value: Object) => ({
  type: POST_DECISION_SUCCESS,
  data: value
});

export const applicationFailure = () => ({
  type: POST_DECISION_FAILURE,
  data: {
    approved: false,
    message: "There was an error approving you loan. Check back later."
  }
});

export const badRequest = (data: boolean) => ({
  type: BAD_REQUEST,
  data
});

export const sendApplication = (answers: {
  [key: string]: string | number;
}) => (dispatch: Dispatch) => {
  const decision = checkApplication(answers);

  if (decision.decision === BAD_REQUEST) {
    //  This a fabricated bad request. A work around for not building out a more robust server
    getBadRequest()
      .then(data => {
        // This should never fire
        console.log("success", data);
      })
      .catch(err => dispatch(badRequest(true)));
  } else {
    const { apiPath, navPath } = decision;
    getDecision(apiPath)
      .then(data => {
        dispatch(applicationSuccess(data));
      })
      .catch(err => {
        dispatch(applicationFailure());
      });
  }

  console.log({ decision });
};
