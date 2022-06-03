const generarId = () => {
  const ramdom = Math.random().toString(32).substring(2);
  const fecha = Date.now().toString(32);
  return ramdom + fecha;
};

export default generarId;
