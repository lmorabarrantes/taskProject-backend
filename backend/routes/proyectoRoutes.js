import express from "express";
import {
  obtenerProyecto,
  nuevoProyecto,
  obtenerProyectos,
  editarProyecto,
  eliminarColaboarador,
  eliminarProyecto,
  agregarColaboarador,
  obtenerTareas,
} from "../controllers/proyectoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();
router
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, nuevoProyecto);
router
  .route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

router.get("/tareas/:id", checkAuth, obtenerTareas);
router.post("/agregar-colaborador/:id", checkAuth, agregarColaboarador);
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaboarador);
export default router;
