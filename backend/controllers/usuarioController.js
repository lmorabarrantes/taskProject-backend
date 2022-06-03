import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
const registrar = async (req, res) => {
  //evitar registros duplicados verificar si esta diplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email: email });
  if (existeUsuario) {
    //generar eror mediante .json
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();
    res.json(usuarioAlmacenado);
  } catch (error) {
    console.log(error);
  }
};
const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //COMPROBAR SI EL USER EXISTE
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("el Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  //COMPROBAR SI EL USER ESTA CONFIRMADO
  if (!usuario.confirmado) {
    const error = new Error("Tu Cuenta no ha sido Confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //COMPROBAR SU PASSWORD
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      //este token es de Json Web Token
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El Password Es Incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};
//ACOUNTS CONFIRM
const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("TOKEN NO VALIDO");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuario.token = generarId();
    await usuario.save();
    res.json({ msg: "EMAIL CON LAS INTRUCCIONES ENVIADO" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "token Valido Usuario existe" });
  } else {
    const error = new Error("TOKEN NO VALIDO");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const usuarioValido = await Usuario.findOne({ token });
  if (usuarioValido) {
    usuarioValido.password = password;
    usuarioValido.token = "";
    try {
      await usuarioValido.save();
      res.json({ msg: "Password Modificado Correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("TOKEN NO VALIDO");
    return res.status(404).json({ msg: error.message });
  }
};
const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};
export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
