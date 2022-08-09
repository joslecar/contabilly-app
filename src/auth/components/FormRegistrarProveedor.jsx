import { useForm } from "../../hooks";
import country from "country-list-js";
import { useEffect, useState } from "react";
import { listaCiudades } from "../../data";
import { AccionExitosaAuth } from "./AccionExitosaAuth";
import { apiUrl } from "../../apiUrl";

export const FormRegistrarProveedor = () => {
  const listaPaises = country.names();
  const listaCiudadesEcuador = listaCiudades;
  const [esEcuador, setEsEcuador] = useState(false);
  const [showAccionExitosa, setShowAccionExitosa] = useState(false);

  //validaciones
  const [esUsuarioValido, setEsUsuarioValido] = useState(false);
  const [esNumeroValido, setEsNumeroValido] = useState(false);
  const [esNombreValido, setEsNombreValido] = useState(false);
  const [esIdentificacionValido, setEsIdentificacionValido] = useState(false);
  const [esContrasenaValido, setEsContrasenaValido] = useState(false);
  const [esEmailValido, setEsEmailValido] = useState(false);
  const [esCiudadValido, setEsCiudadValido] = useState(false);

  const {
    formState, Nombre, Identificacion, Usuario, Contrasena, Email, Numero, Pais, Ciudad, direccion, onInputChange} = useForm({
      IdRol: 2, 
      Nombre: "", 
      Identificacion: "", 
      Usuario: "", 
      Contrasena: "", 
      Email: "", 
      Numero: "", 
      Pais: "", 
      Ciudad: "", 
      Direccion: "",
    });

  const uploadUser = async() => {
    const body = formState;
    const resp = await fetch(`${apiUrl}/usuarios`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await resp.json()
    console.log(data);
  }

  useEffect(() => {
    setEsEcuador(Pais === "Ecuador");
  }, [Pais])

  useEffect(() => {
    setEsUsuarioValido(true);
  }, [Usuario])

  useEffect(() => {
    setEsNumeroValido(true);
  }, [Numero])

  useEffect(() => {
    setEsNombreValido(true);
  }, [Nombre])
  
  useEffect(() => {
    setEsEmailValido(true);
  }, [Email])
  
  useEffect(() => {
    setEsIdentificacionValido(true);
  }, [Identificacion])
  
  useEffect(() => {
    setEsContrasenaValido(true);
  }, [Contrasena])
  
  useEffect(() => {
    setEsCiudadValido(true);
  }, [Ciudad])

  //metodos validaciones
  const checkValidUsername = async() => {
    const regexUsername = /^[a-zA-Z0-9_]{3,30}$/;
    if(!regexUsername.test(Usuario)){
      setEsUsuarioValido(false);
      return;
    }
    const resp = await fetch(`${apiUrl}/validarusuario?username=${Usuario}`);
    const data = await resp.json();
    const {rows: result} = !!data && data;
    setEsUsuarioValido(result.length === 0);
    return;
  }

  const validarTodosCampos = () => {
    //se setean todos los campos validadores
    return new Promise((resolve, reject) => {
      
      checkValidUsername();

      const regexEmail = /^\w+([-]?\w+)*@\w+([-]?\w+)*(.\w{2,3})+$/;
      const regexNumero = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/im;
      const regexCedula = /^[0-9]{9}[-]?[0-9]$/;
      const regexContrasena = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      const regexNombre = /^[a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ']+[ -][a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ ,.'-]+$/;
      const regexCiudad = /^[a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ']+([ -][a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ ,.'-]+)?$/;
      
      if(regexCiudad.test(Ciudad) && regexCedula.test(Identificacion) && regexNombre.test(Nombre) &&
      regexEmail.test(Email) && regexNumero.test(Numero) && regexContrasena.test(Contrasena)) {
        resolve(true)
      } else {
        setEsCiudadValido(regexCiudad.test(Ciudad));
        setEsIdentificacionValido(regexCedula.test(Identificacion));
        setEsNombreValido(regexNombre.test(Nombre));
        setEsEmailValido(regexEmail.test(Email));
        setEsNumeroValido(regexNumero.test(Numero));
        setEsContrasenaValido(regexContrasena.test(Contrasena));

        reject(false);
      }
    })    
  }

  const onRegistrarComprador = (e) => {
    e.preventDefault();
    validarTodosCampos()
      .then(res => uploadUser().then(setShowAccionExitosa(true)))
      .catch(res => {console.warn("Usuario no válido")})
  }

  return (
    <form onSubmit={onRegistrarComprador}>
    <div className="compraProducto__box">
      <p className="paragraph">Ingresar los siguientes datos:</p>
      <hr className="hrGeneral"/>
      <div className="u-margin-top-small"></div> 
      <div className="formRegistrarComp__twoInputsBox">
        <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
          <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
            <label htmlFor="compradorUsuario" className="paragraph--sm">Usuario</label>
            <input
              id="compradorUsuario"
              type="text"
              placeholder="empresagye"
              className="formSubirProducto__input paragraph"
              name="Usuario"
              value={Usuario}
              onChange={onInputChange}
              required
            />
          </div>
          {
            !esUsuarioValido &&
            <p className="paragraph--red">Usuario no válido</p>
          }
        </div>
        <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
          <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
            <label htmlFor="compradorContrasena" className="paragraph--sm">Contraseña</label>
            <input
              id="compradorContrasena"
              type="password"
              placeholder="contrasena123!"
              className="formSubirProducto__input paragraph"
              name="Contrasena"
              value={Contrasena}
              onChange={onInputChange}
              required
            />
          </div>
          {
            !esContrasenaValido &&
            <p className="paragraph--red">Su contraseña debe contener al menos 1 dígito, 1 letra mayúscula y minúscula y ser mayor a 8 caracteres.</p>
          }
        </div>
      </div>
        
      <div className="formRegistrarComp__twoInputsBox">
        <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
          <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
            <label htmlFor="compradorName" className="paragraph--sm">Empresa</label>
            <input
              id="compradorName"
              type="text"
              placeholder="Nombre de la empresa"
              className="formSubirProducto__input paragraph"
              name="Nombre"
              value={Nombre}
              onChange={onInputChange}
              required
            />
          </div>
          {
            !esNombreValido &&
            <p className="paragraph--red">Nombre y apellido no válidos</p>
          }
        </div>
        <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
          <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
            <label htmlFor="compradorIdentificacion" className="paragraph--sm">C.I.</label>
            <input
              id="compradorIdentificacion"
              type="text"
              placeholder="0987654321"
              className="formSubirProducto__input paragraph"
              name="Identificacion"
              value={Identificacion}
              onChange={onInputChange}
              required
            />
          </div>
          {
            !esIdentificacionValido &&
            <p className="paragraph--red">C.I. no válida</p>
          }
        </div>
      </div>
      <div className="formRegistrarComp__twoInputsBox">
        <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
          <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
            <label htmlFor="compradorEmail" className="paragraph--sm">E-mail</label>
            <input
              id="compradorEmail"
              type="text"
              placeholder="example@gmail.com"
              className="formSubirProducto__input paragraph"
              name="Email"
              value={Email}
              onChange={onInputChange}
              required
            />
          </div>
          {
            !esEmailValido &&
            <p className="paragraph--red">Email no válido</p>
          }
        </div>
        <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
          <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
            <label htmlFor="compradorCelular" className="paragraph--sm">Celular</label>
            <input
              id="compradorCelular"
              type="text"
              placeholder="0998950947"
              className="formSubirProducto__input paragraph"
              name="Numero"
              value={Numero}
              onChange={onInputChange}
              required
            />
          </div>
          {
            !esNumeroValido &&
            <p className="paragraph--red">Número no válido</p>
          }
        </div>
      </div>
        <div className="formRegistrarComp__twoInputsBox">
          <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
            <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
              <label htmlFor="compradorPais" className="paragraph--sm">País</label>
              <select 
                name="Pais"
                className="formSubirProducto__input paragraph"
                onChange={onInputChange}
              >
                <option defaultValue={"none"}>
                  Seleccionar País
                </option> 
                {
                  listaPaises?.map(pais => 
                    <option value={pais} key={pais}>
                      {pais}
                    </option>)
                }
              </select>
            </div>
          </div>
          { esEcuador &&
            <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
              <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
                <label htmlFor="compradorCiudad" className="paragraph--sm">Ciudad</label>
                <select 
                  id="compradorCiudad"
                  name="Ciudad"
                  className="formSubirProducto__input paragraph"
                  onChange={onInputChange}
                >
                  <option defaultValue={"none"}>
                    Seleccionar Ciudad
                  </option> 
                  {
                    listaCiudadesEcuador?.map(ciudad => 
                      <option value={ciudad.city} key={ciudad.city}>
                        {ciudad.city}
                      </option>)
                  }
                </select>
              </div>
              {
                (!esCiudadValido || Ciudad === "Seleccionar Ciudad") &&
                <p className="paragraph--red">Ciudad no válida</p>
              }
            </div>
            
          }
          {!esEcuador && 
            <div className="formRegistrarComp__twoInputsBox__izq u-margin-top-small">
              <div className="formRegistrarComp__twoInputsBox__izq__labelInput">
                <label htmlFor="compradorCiudad" className="paragraph--sm">Ciudad</label>
                <input
                  id="compradorCiudad"
                  type="text"
                  placeholder="Ingresar ciudad"
                  className="formSubirProducto__input paragraph"
                  name="Ciudad"
                  value={Ciudad}
                  onChange={onInputChange}
                  required
                />
              </div>
              {
                !esCiudadValido &&
                <p className="paragraph--red">Ciudad no válida</p>
              }
            </div>
          }
        </div>
        <div className="formRegistrarComp__twoInputsBox__one u-margin-top-small">
          <div className="formRegistrarComp__twoInputsBox__one__labelInput"> 
            <label htmlFor="compradorDireccion" className="paragraph--sm">Dirección</label>
            <textarea
              id="compradorDireccion"
              type="text"
              placeholder="Vía Daule km 36"
              className="formRegistrarComp__textArea paragraph"
              name="Direccion"
              value={direccion}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
    </div>

    <div className="metodoPago__btnBox">
      <button
        type="submit" 
        className="btn btn--green"
      >Registrarme</button>
    </div>
    <div>
      {
        showAccionExitosa &&
        <AccionExitosaAuth
          texto={'¡Se ha registrado exitosamente!'}
          setShowAccionExitosa={setShowAccionExitosa}
        />
      }
    </div>
  </form>
  )
}
