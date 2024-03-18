require("dotenv").config();
const {
    AccountId,
    PrivateKey,
    Client,
    Hbar,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenMintTransaction,
    TransferTransaction,
    AccountBalanceQuery,
    TokenAssociateTransaction,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromStringECDSA(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const supplyKey = PrivateKey.generate();
//console.log("supplyKey", supplyKey);

async function mintNft() {
    //Deployed NFT Token ID
    const tokenId = "0.0.3727518";
    // Max transaction fee as a constant
    const maxTransactionFee = new Hbar(50);

    //IPFS content identifiers for which we will create a NFT
    const CID = [
        Buffer.from(
            "ipfs://QmdA4ya2Nzwo2FT7utMCf91aoi1sZ1ZfnwsGafLg68ArU2/1.json"
        ),
        Buffer.from(
            "ipfs://QmdA4ya2Nzwo2FT7utMCf91aoi1sZ1ZfnwsGafLg68ArU2/2"
        ),
        Buffer.from(
            "ipfs://QmdA4ya2Nzwo2FT7utMCf91aoi1sZ1ZfnwsGafLg68ArU2/3"
        ),
        Buffer.from(
            "ipfs://QmdA4ya2Nzwo2FT7utMCf91aoi1sZ1ZfnwsGafLg68ArU2/4"
        ),
        Buffer.from(
            "ipfs://QmdA4ya2Nzwo2FT7utMCf91aoi1sZ1ZfnwsGafLg68ArU2/5"
        )
    ];

    // MINT NEW BATCH OF NFTs
    const mintTx = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
        .setMaxTransactionFee(maxTransactionFee)
        .freezeWith(client);

    //Sign the transaction with the supply key
    const mintTxSign = await mintTx.sign(supplyKey);

    //Submit the transaction to a Hedera network
    const mintTxSubmit = await mintTxSign.execute(client);

    //Get the transaction receipt
    const mintRx = await mintTxSubmit.getReceipt(client);

    //Log the serial number
    console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);
}
mintNft();