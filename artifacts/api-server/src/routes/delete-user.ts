import { Router, type IRouter } from "express";
import { z } from "zod";
import { auth } from "../lib/firebase";

const router: IRouter = Router();

const DeleteUserBody = z.object({
  uid: z.string().min(1, "uid is required"),
});

router.post("/delete-user", async (req, res) => {
  const parsed = DeleteUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const { uid } = parsed.data;

  try {
    await auth.deleteUser(uid);
    req.log.info({ uid }, "Firebase user deleted");
    res.json({ success: true, uid });
  } catch (err: unknown) {
    const firebaseError = err as { code?: string; message?: string };
    if (firebaseError.code === "auth/user-not-found") {
      res.status(404).json({ error: "User not found", uid });
      return;
    }
    req.log.error({ uid, err }, "Failed to delete Firebase user");
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
