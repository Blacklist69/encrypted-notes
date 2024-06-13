document.addEventListener('DOMContentLoaded', () => {
    const noteTextarea = document.getElementById('note');
    const encryptedTextarea = document.getElementById('encryptedNote');
    const decryptedTextarea = document.getElementById('decryptedNote');
    const toggleDecryptedButton = document.getElementById('toggleDecrypted');
    const decryptedSection = document.getElementById('decryptedSection');

    let key, iv;

    // Generate AES key and IV
    window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    ).then(generatedKey => {
        key = generatedKey;
        iv = window.crypto.getRandomValues(new Uint8Array(16));
    });

    noteTextarea.addEventListener('input', async () => {
        const text = noteTextarea.value;
        if (text) {
            const encryptedText = await encryptText(text);
            encryptedTextarea.value = encryptedText;
            const decryptedText = await decryptText(encryptedText);
            decryptedTextarea.value = decryptedText;
        } else {
            encryptedTextarea.value = '';
            decryptedTextarea.value = '';
        }
    });

    toggleDecryptedButton.addEventListener('click', () => {
        if (decryptedSection.style.display === 'none') {
            decryptedSection.style.display = 'block';
            toggleDecryptedButton.textContent = 'Ocultar Texto Desencriptado';
        } else {
            decryptedSection.style.display = 'none';
            toggleDecryptedButton.textContent = 'Mostrar Texto Desencriptado';
        }
    });

    async function encryptText(plainText) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plainText);

        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv: iv,
            },
            key,
            data
        );

        return bufferToHex(encrypted);
    }

    async function decryptText(encryptedHex) {
        const encryptedBytes = hexToBuffer(encryptedHex);

        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv: iv,
            },
            key,
            encryptedBytes
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }

    function bufferToHex(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    function hexToBuffer(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        return bytes.buffer;
    }
});


