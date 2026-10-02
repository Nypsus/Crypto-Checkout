/* =====================================================================
   Checkout Crypto — Configuration
   ---------------------------------------------------------------------
   Tout se règle ici : réseau, contrat, produits affichés.
   Le PRIX affiché et payé vient TOUJOURS du contrat (jamais d'ici).
   ===================================================================== */
window.CHECKOUT_CONFIG = {

  // ---- Marque / affichage ----
  brand: 'Paiement crypto',

  // ---- Réseau ----
  chain: {
    id: 56,                                            // BNB Smart Chain mainnet
    hexId: '0x38',
    name: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    explorer: 'https://bscscan.com'
  },

  // RPC publics pour lire le contrat SANS wallet.
  // La page les essaie dans l'ordre et bascule automatiquement sur le
  // suivant en cas de lenteur/erreur (timeout de 9 s par appel).
  readRpcs: [
    'https://bsc-rpc.publicnode.com',
    'https://bsc-dataseed.binance.org/',
    'https://rpc.ankr.com/bsc'
  ],

  // ---- Contrat de paiement ----
  // V1 actuel (BNB uniquement) : 0xCd25eee89Bb01603f0E0cf8D8C243966a926761d
  // Quand tu déploies contract/CheckoutV2.sol, remplace par la nouvelle adresse.
  contract: '0xCd25eee89Bb01603f0E0cf8D8C243966a926761d',
  nativeToken: '0x0000000000000000000000000000000000000000', // adresse 0 = BNB dans pay()

  // ---- Paiement en USDT (stablecoin) ----
  // L'option USDT ne s'affiche automatiquement QUE si le contrat renvoie un
  // prix USDT pour le produit (contrat CheckoutV2 — voir README).
  usdt: {
    enabled: true,
    address: '0x55d398326f99059fF775485246999027B3197955', // Binance-Peg USDT (BSC, 18 décimales)
    symbol: 'USDT',
    decimals: 18
  },

  // ---- Produits (métadonnées affichées) ----
  // La clé = le productId enregistré dans le contrat (setProductPrice).
  products: {
    product1: { name: 'Indicateur Daily',  description: 'Accès à l’indicateur Daily — Les Indicateurs à Levier' },
    product2: { name: 'Indicateur 4h/1h',  description: 'Accès à l’indicateur 4h/1h — Les Indicateurs à Levier' },
    product3: { name: 'Indicateur 15mn',   description: 'Accès à l’indicateur 15mn — Les Indicateurs à Levier' },

    // ---- Honest Switch : fiches méthode (2 €) ----
    'verifier-plateforme-agreee': { name: 'Fiche — Vérifier une plateforme agréée', description: 'La méthode en 7 contrôles + checklist imprimable (Honest Switch)' },
    'resiliation-recommandee':    { name: 'Fiche — Résiliation par recommandé',     description: 'Modèle de mise en demeure + escalade en 4 étapes (Honest Switch)' },
    'mailchimp-hausse-prix':      { name: 'Fiche — Ce que Mailchimp facture',       description: 'Recalcul de la facture + procédure de nettoyage (Honest Switch)' },
    'repeater-wifi-promo':        { name: 'Fiche — Vérifier une promo',             description: 'Traçage du prix + seuil de décision (Honest Switch)' },
    'tracker-find-my-diy':        { name: 'Fiche — Tracker Localiser maison',       description: 'Liste d’achat + limites réelles (Honest Switch)' },
    'etiquettes-eink-esl':        { name: 'Fiche — Étiquettes e-ink (ESL)',         description: 'Méthode de flash + modèles non récupérables (Honest Switch)' }
  },

  // ---- Options d'affichage ----
  showUsdEstimate: true,   // estimation en $ au taux CoinGecko (affichage seulement)
  successRedirect: null    // URL de redirection après paiement réussi (null = écran de succès)
                           // surchargeable par le lien : ?redirect=https://...
};