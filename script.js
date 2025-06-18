
function genererMotDePasse(nom, prenom) {
  const currentYear = new Date().getFullYear();
  const prenom1 = prenom.slice(0,2).toUpperCase();
  const nom1 = nom.slice(0,2).toUpperCase();
  
  const motDePasse = prenom1+nom1+currentYear;
  return motDePasse;
}

module.exports={
    genererMotDePasse,
}