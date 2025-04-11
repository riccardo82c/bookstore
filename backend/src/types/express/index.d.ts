import { IUserDocument } from "../../models/User.ts"

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument
      // Puoi aggiungere qui altre proprietà che verranno aggiunte da altri middleware
    }
  }
}
