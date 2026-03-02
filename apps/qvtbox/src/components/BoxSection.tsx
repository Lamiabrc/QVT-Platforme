import { Link } from "react-router-dom";
import boxImage from "@/assets/box-artisanal.jpg";

const BoxSection = () => {
  return (
    <section className="section-gradient py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-6">
            Nos <span className="text-primary">Box Magiques</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-light mb-6">
            Chaque box est pensee comme un cadeau bienveillant, remplie de produits
            francais artisanaux choisis avec coeur.
          </p>
          <div className="card-bubble p-6 max-w-4xl mx-auto">
            <p className="text-lg text-foreground/80 leading-relaxed font-light">
              Parce que les salaries ont besoin de moyens visibles et utiles, nos box apportent des
              reponses concretes aux realites du travail : fatigue, charge, cohesion,
              reconnaissance. Elles sont concues pour etre offertes par l'entreprise a ses
              collaborateurs comme preuves tangibles d'attention et de soutien.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="card-bubble p-8 hover:shadow-floating transition-all duration-300">
            <h3 className="text-2xl font-kalam font-bold text-primary mb-4">Box Thematiques</h3>
            <p className="text-primary font-medium mb-6 text-sm uppercase tracking-wide">
              Pour gerer le stress, la mobilite, la penibilite et renforcer la cohesion, avec des
              produits utiles et accessibles.
            </p>
            <p className="text-foreground/70 mb-6">
              Des solutions ciblees pour chaque besoin de votre equipe
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Focus & Reset", "Mobilite", "Penibilite", "Cohesion"].map((box, boxIndex) => (
                <div key={boxIndex} className="bg-primary/5 rounded-xl p-3 text-center">
                  <span className="text-sm font-medium text-primary">{box}</span>
                </div>
              ))}
            </div>

            <Link to="/box" className="inline-block btn-soft w-full text-center">
              Voir tous les details
            </Link>
          </div>

          <div className="card-bubble p-8 hover:shadow-floating transition-all duration-300">
            <h3 className="text-2xl font-kalam font-bold text-secondary mb-4">
              Box Evenementielles
            </h3>
            <p className="text-primary font-medium mb-6 text-sm uppercase tracking-wide">
              Pour celebrer les moments de vie, renforcer le collectif et valoriser chaque etape.
            </p>
            <p className="text-foreground/70 mb-6">
              Celebrez les moments importants avec delicatesse
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Retraite", "Naissance", "Anniversaire", "Promotion", "Mariage"].map(
                (box, boxIndex) => (
                  <div key={boxIndex} className="bg-secondary/5 rounded-xl p-3 text-center">
                    <span className="text-sm font-medium text-secondary">{box}</span>
                  </div>
                )
              )}
            </div>

            <Link to="/box" className="inline-block btn-soft w-full text-center">
              Voir tous les details
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src={boxImage}
              alt="Box artisanale francaise avec produits naturels"
              className="w-full rounded-2xl shadow-bubble"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl font-kalam font-bold text-foreground mb-6">
              Made in <span className="text-primary">France</span> avec amour
            </h3>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Nos box rassemblent le meilleur de l'artisanat francais : tisanes bio, carnets
              manuscrits, objets du quotidien penses pour le bien-etre. Chaque produit raconte une
              histoire, chaque box cree du lien.
            </p>
            <Link to="/box" className="btn-bubble">
              Soutenir mes equipes avec une Box
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxSection;
