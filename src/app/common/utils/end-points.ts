import { environment } from "@env";

export class EndPoints {
  static readonly MEMBERSHIPS = environment.REST_CORE + "/memberships";
}
