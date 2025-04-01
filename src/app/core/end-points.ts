import { environment } from "@env";

export class EndPoints {
  static readonly MEMBERSHIPS = environment.REST_CORE + "/memberships";
  static readonly REAL_STATE_COMPANIES = environment.REST_CORE + "/real-state-companies";
  static readonly USERS = environment.REST_USER + '/users';
  static readonly OPERATORS = EndPoints.USERS + "/operator"
  static readonly STAFF = EndPoints.USERS  + "/staff"
}
