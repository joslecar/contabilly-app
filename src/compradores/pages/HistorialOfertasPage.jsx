import { useContext } from "react";
import { AuthContext } from "../../auth";
import { ContActividades, ContExplorar, ContFavoritos, OfertaCard } from "../../components"
import { getOfertaById, getOfertasIndividualesByCompradorId } from "../../helpers/getOfertaById";

export const HistorialOfertasPage = () => {

  const {authState} = useContext(AuthContext);
  const {user} = authState;
  const ofertaComprador = getOfertasIndividualesByCompradorId(user.id);
  
  const ofertas = ofertaComprador.map(oferta => {
    return getOfertaById(oferta.idOferta);
  })

  return (
    <div className="comp-main-container u-margin-top-navbar">
      <div className="comp-main-container__izqCont">
        <ContExplorar/>
        <ContFavoritos/>
      </div>
      <div className="comp-main-container__divSepIzq"></div>
      <div className="comp-main-container__medCont">
        <div className="comp-main-container__medCont__ofertas">
        <div className="explorarCat__title">
          <span className="material-symbols-rounded icon-grey icon--sm">
              arrow_forward_ios
          </span>
          <p className="paragraph--mid"><b>Historial de ofertas</b></p>
          </div>
          {ofertas.map(oferta => (
            <OfertaCard 
              key={oferta.idOferta}
              oferta={oferta}
            />
          ))}
        </div>
      </div>
      <div className="comp-main-container__divSepDer"></div>
      <div className="comp-main-container__derCont">
        <ContActividades/>
      </div>
    </div>
  )
}
