const web3 = require("@solana/web3.js");

const checkWalletBalance = async (connection, pubKey) => {
    try {
        const balance = await connection.getBalance(pubKey);
        console.log(`Amount of SOL: ${parseInt(balance)/web3.LAMPORTS_PER_SOL}`);
    } catch (err) {
        console.log(err);
    }
    
};

const airdropSOL = async (connection, pubKey, amount) => {
    try {
        console.log('Airdropping SOL...');
        // Need to wait a confirmation signature is received
        const fromAirdropSignature = await connection.requestAirdrop(
            pubKey, amount * web3.LAMPORTS_PER_SOL
        );
        
        await connection.confirmTransaction(fromAirdropSignature);
    } catch (err) {
        console.log(err);
    }
};



const transferSOL = async (fromWallet, toWallet, transferAmount) => {
    try {
        // Connect to the network
        const connection = new web3.Connection(
            web3.clusterApiUrl("devnet"), "confirmed"
        );
    
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(fromWallet.publicKey.toString()),
                toPubkey: new web3.PublicKey(toWallet.publicKey.toString()),
                lamports: transferAmount * web3.LAMPORTS_PER_SOL
            })
        )

        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet]
        )
        return signature;
    } catch (err) {
        console.log(err);
    }
};

module.exports={
    checkWalletBalance,
    airdropSOL,
    transferSOL
}