import { Router, type IRouter } from "express";
import healthRouter from "./health";
import deleteUserRouter from "./delete-user";

const router: IRouter = Router();

router.use(healthRouter);
router.use(deleteUserRouter);

export default router;
