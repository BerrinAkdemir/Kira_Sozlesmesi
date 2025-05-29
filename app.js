window.addEventListener('DOMContentLoaded', () => {
    const contractAddress = "0x751Dd8e068c9C869EAcA14d8B77a8A316155B24B";
    const targetChainId = "0xaa36a7"; // Sepolia Testnet Chain ID

    const contractABI = [
    {
        "inputs": [],
        "name": "evSahibi",
        "outputs": [
            { "internalType": "address payable", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "kiraKayitlari",
        "outputs": [
            { "internalType": "address", "name": "kiraci", "type": "address" },
            { "internalType": "uint256", "name": "miktar", "type": "uint256" },
            { "internalType": "uint256", "name": "tarih", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "kiraOde",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllKiraKayitlari",
        "outputs": [
            {
                "components": [
                    { "internalType": "address", "name": "kiraci", "type": "address" },
                    { "internalType": "uint256", "name": "miktar", "type": "uint256" },
                    { "internalType": "uint256", "name": "tarih", "type": "uint256" }
                ],
                "internalType": "struct BasitKiraSozlesmesi.KiraKaydi[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

    // Yeni fonksiyon
    async function updatePaymentHistory() {
        try {
            const allPayments = await contract.getAllKiraKayitlari();
            const historyDiv = document.getElementById('paymentHistory');
            
            let html = `
                <table class="payment-table">
                    <thead>
                        <tr>
                            <th>Kiracı Adresi</th>
                            <th>Miktar (ETH)</th>
                            <th>Tarih</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (let i = allPayments.length - 1; i >= 0; i--) {
                const payment = allPayments[i];
                const date = new Date(payment.tarih * 1000).toLocaleString('tr-TR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const amount = ethers.utils.formatEther(payment.miktar);
                
                html += `
                    <tr>
                        <td title="${payment.kiraci}">${payment.kiraci.substring(0, 6)}...${payment.kiraci.slice(-4)}</td>
                        <td>${parseFloat(amount).toFixed(3)}</td>
                        <td>${date}</td>
                    </tr>
                `;
            }

            html += '</tbody></table>';
            
            if(allPayments.length === 0) {
                html = '<div class="info">Henüz ödeme kaydı bulunmamaktadır</div>';
            }
            
            historyDiv.innerHTML = html;

        } catch (err) {
            console.error('Kayıtlar alınamadı:', err);
            historyDiv.innerHTML = '<div class="error">Kayıtlar yüklenirken hata oluştu</div>';
        }
    }

    const connectButton = document.getElementById("connectButton");
    const walletAddressElem = document.getElementById("walletAddress");
    const contractAddressElem = document.getElementById("contractAddress");
    const rentAmountElem = document.getElementById("rentAmount");
    const rentDateElem = document.getElementById("rentDate");
    const payButton = document.getElementById("payButton");
    const amountInput = document.getElementById("amount");
    const statusElem = document.getElementById("status");

    let provider, signer, contract;

    const statusMessages = {
        connecting: "🔄 MetaMask'e bağlanılıyor...",
        connected: "✅ Cüzdan başarıyla bağlandı!",
        wrongNetwork: "⚠️ Lütfen Sepolia Testnet ağına geçiş yapın!",
        paymentProgress: "⏳ İşlem onay bekleniyor...",
        success: tx => `✅ Ödeme başarılı!<br><a href="https://sepolia.etherscan.io/tx/${tx}" target="_blank">İncele: ${tx.substring(0, 12)}...</a>`,
        error: msg => `❌ Hata: ${msg}`
    };

    function showStatus(message, type = "info") {
        statusElem.innerHTML = message;
        statusElem.className = type;
        statusElem.style.display = "block";
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    async function checkNetwork() {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== targetChainId) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: targetChainId }]
                });
            }
            return true;
        } catch (err) {
            showStatus(statusMessages.wrongNetwork, "error");
            return false;
        }
    }

    async function connectWallet() {
        if (!window.ethereum) {
            showStatus(statusMessages.error("MetaMask yüklü değil!"), "error");
            return;
        }

        try {
            showStatus(statusMessages.connecting, "info");

            if (!await checkNetwork()) return;

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            const userAddress = accounts[0];
            walletAddressElem.textContent = userAddress;
            contractAddressElem.textContent = contractAddress;

            // Son kira kaydını al
            let index = 0;
            while (true) {
                try {
                    await contract.kiraKayitlari(index);
                    index++;
                } catch (e) {
                    break;
                }
            }

            if (index > 0) {
                const lastPayment = await contract.kiraKayitlari(index - 1);
                const amountEth = ethers.utils.formatEther(lastPayment.miktar);
                rentAmountElem.textContent = `${amountEth} ETH`;
                rentDateElem.textContent = new Date(lastPayment.tarih * 1000).toLocaleString("tr-TR");
            } else {
                rentAmountElem.textContent = "-";
                rentDateElem.textContent = "-";
            }

            showStatus(statusMessages.connected, "success");
            payButton.disabled = false;

        } catch (err) {
            showStatus(statusMessages.error(err.message), "error");
        }
    }

    async function makePayment() {
        const amount = amountInput.value;

        if (!amount || parseFloat(amount) < 0.01) {
            showStatus(statusMessages.error("Geçerli bir miktar girin (en az 0.01 ETH)"), "error");
            return;
        }

        try {
            showStatus(statusMessages.paymentProgress, "info");

            const tx = await contract.kiraOde({
                value: ethers.utils.parseEther(amount),
                gasLimit: 300000
            });

            const receipt = await tx.wait(2);
            showStatus(statusMessages.success(receipt.transactionHash), "success");

            rentAmountElem.textContent = `${amount} ETH`;
            rentDateElem.textContent = new Date().toLocaleString("tr-TR");

        } catch (err) {
            const message = err.data?.message || err.message;
            showStatus(statusMessages.error(message), "error");
        }
    }

    connectButton.addEventListener("click", connectWallet);
    payButton.addEventListener("click", makePayment);

    // MetaMask olayları
    if (window.ethereum) {
        window.ethereum.on("accountsChanged", () => window.location.reload());
        window.ethereum.on("chainChanged", () => window.location.reload());
    }
});
