# Crypto-Checkout — système de paiement crypto par lien (BSC)

Checkout crypto **générique** : l'acheteur ouvre un lien de paiement, tout est
pré-rempli (produit → montant → adresse de destination = le contrat).
Il ne saisit **jamais** de montant ni d'adresse : il confirme simplement dans
son wallet.

- **Non-custodial** : les fonds vont directement au contrat de paiement
  (aucun intermédiaire, aucun compte à créer).
- **Sans build** : `index.html` + `config.js` + `app.js` → déployable sur
  n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages…).
- **Le prix vient toujours de la blockchain** (contrat). `config.js` ne
  contient que les métadonnées d'affichage (nom / description).

## Créer un lien de paiement

    https://<ton-domaine>/?product=<productId>

Paramètres optionnels :
- `redirect` : URL vers laquelle rediriger après un paiement réussi
  (page de livraison, espace client…)
- `ref` : valeur de tracking, ajoutée au `redirect` (`?ref=...`)

Exemples :

    ?product=product1
    ?product=product1&redirect=https://exemple.com/merci
    ?product=product2&redirect=https://exemple.com/acces&ref=instagram

Sans paramètre `product`, la page affiche la liste des produits configurés.

## Ajouter / modifier un produit

1. **Prix (on-chain, depuis le wallet propriétaire)** :
   `setProductPrice("mon-produit", <prix en wei>)`
   - 0.5 BNB → `500000000000000000`
   - À faire depuis Remix (onglet « Write Contract », wallet = owner) ou sur
     BscScan → contrat → « Write Contract ».
2. **Affichage (facultatif)** : ajoute une entrée dans `products` dans
   `config.js` (nom + description).
3. Crée le lien : `?product=mon-produit`.

## Paiement en USDT (stablecoin)

Le contrat V1 déployé
(`0xCd25eee89Bb01603f0E0cf8D8C243966a926761d`) ne permet **pas** un paiement
USDT au bon prix : `pay()` exige `amount == prix du produit`, et le prix est
une valeur unique — payer en USDT au prix BNB (ex. 0.3184) ne débiterait que
**0.3184 USDT**. C'est pour ça que l'option USDT est automatiquement masquée
tant que le contrat ne renvoie pas de prix USDT.

Pour activer l'USDT proprement, déployer **`contract/CheckoutV2.sol`**
(prix par devise) :

1. Ouvre https://remix.ethereum.org → nouveau fichier `CheckoutV2.sol` →
   colle le contenu de `contract/CheckoutV2.sol`.
2. Onglet « Solidity compiler » : 0.8.20+ → Compile.
3. Onglet « Deploy » : Environment = **Injected Provider - MetaMask**
   (MetaMask sur BSC), constructeur `tokens` (adresse[]):
   `["0x55d398326f99059fF775485246999027B3197955"]` (USDT BSC) → Deploy.
4. Note l'adresse du nouveau contrat. Depuis le wallet propriétaire :
   - `setProductPrice("product1", 318400000000000000)` (prix BNB, comme avant)
   - `setProductPriceInToken("product1", "0x55d398326f99059fF775485246999027B3197955", 200000000000000000000)` (prix USDT, 18 décimales → 200 USDT)
5. Dans `config.js`, remplace `contract` par la nouvelle adresse.
6. Vérifie le contrat sur BscScan (« Verify and Publish », API level 3, les
   sources sont incluses dans le fichier) pour afficher le badge vérifié.

Dès que `productPriceInToken` renvoie un prix > 0 pour un produit, le bouton
« Payer en USDT » s'active tout seul. Le paiement USDT = 2 confirmations
(approbation du **montant exact**, puis paiement) — c'est la norme BEP20.

> Le contrat V1 reste en place et continue de fonctionner pour les paiements
> BNB. V2 = nouvelle adresse, même wallet propriétaire, aucun impact sur V1.

## Déployer la page

N'importe quel hébergeur statique :
- **Netlify** : glisser-déposer le dossier, ou connecter le repo.
- **Vercel** : importer le repo (aucun build détecté = site statique).
- **GitHub Pages** : Settings → Pages → branche `main` (repo public requis
  sur l'offre gratuite).

## Intégrer sur tes pages

Un simple lien suffit :

```html
<a href="https://<checkout>/?product=product1&redirect=https://<ta-page-merci>">
  Payer maintenant
</a>
```

## Notes

- Le wallet affichera toujours la destination (le contrat) et le montant —
  c'est sa sécurité, et c'est normal. L'acheteur n'a rien à recopier.
- Ne jamais mettre de clé privée ici : aucun secret n'est nécessaire.
- `config.js` → `showUsdEstimate` : estimation $ via CoinGecko (affichage
  seulement, jamais utilisée pour calculer le montant payé).

## Structure

    index.html              page (UI + styles)
    app.js                  logique (lecture contrat, wallet, paiement)
    config.js               réglages : contrat, produits, options
    contract/CheckoutV2.sol contrat multi-devises à déployer pour l'USDT