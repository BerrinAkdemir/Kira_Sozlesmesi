// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasitKiraSozlesmesi {
    struct KiraKaydi {
        address kiraci;
        uint256 miktar;
        uint256 tarih;
    }
    
    KiraKaydi[] public kiraKayitlari;
    address payable public evSahibi;

    constructor() {
        evSahibi = payable(msg.sender);
    }

    function kiraOde() external payable {
        require(msg.value > 0, "Kira 0 olamaz");
        
        kiraKayitlari.push(KiraKaydi({
            kiraci: msg.sender,
            miktar: msg.value,
            tarih: block.timestamp
        }));
        
        evSahibi.transfer(msg.value);
    }
        
    // Yeni eklenen fonksiyon
    function getAllKiraKayitlari() external view returns (KiraKaydi[] memory) {
        return kiraKayitlari;
    }
}