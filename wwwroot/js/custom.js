

    var uzunluk = document.getElementById("uzunluk").val = 23;

    var genislik = document.getElementById("genislik").val = 3.5;

    var uzun = (document.getElementById("uzunluk").val) * 96 / 2.54;
    var genis = (document.getElementById("genislik").val) * 96 / 2.54;


    $(document).ready(function () {
        $('#uzunluk').on('input', function () {
            uz = $('#uzunluk').val();
            console.log(uz);
            $('div.price').text(uz);
        });
    });


    $(document).ready(function () {
        $('#genislik').on('input', function () {
            gen = $('#genislik').val();
            console.log(gen);
            $('div.price2').text(gen);
        });
    });

    function searchData(query) {
        if (query == '') {
        $.ajax({
            type: "POST",
            url: "/Fit/Index",
            data: { search: query },
            datatype: "html",
            success: function (data) {
                $('#result').html(data);
            }
        });
        }

    else {
        $.ajax({
            type: "POST",
            url: "/Fit/LiveSearch",
            data: { search: query },
            datatype: "html",
            success: function (data) {
                $('#result').html(data);
            }
        });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var query = $('#search').val();
    searchData(query);
    });

    // Arama kutusunda her bir tuşa basıldığında çalışacak kısım
    document.getElementById('search').addEventListener('keyup', function () {
        var query = $(this).val();
    searchData(query);
    });
    var intervalID;

    // Interval fonksiyonu
    function kontrolEt() {
        var secilenCheckboxSayisi = $('input[type="checkbox"]:checked').length;

        if (secilenCheckboxSayisi > 5) {
        clearInterval(intervalID);
    alert("En fazla 5 checkbox seçilebilir!");
        }

    // Tüm checkboxları dolaş
    $('input[type="checkbox"]').each(function () {
            // Seçilen checkbox değilse ve en fazla 5 checkbox seçilmişse
            if (!$(this).prop('checked') && secilenCheckboxSayisi >= 5) {
        // Checkbox'ı devre dışı bırak
        $(this).prop('disabled', true);
            } else {
        // Checkbox'ı aktif hale getir
        $(this).prop('disabled', false);
            }
        });
    }

    // Interval'ı başlat
    intervalID = setInterval(kontrolEt, 100);

    // Checkbox değişikliklerini dinle
    $('input[type="checkbox"]').change(function () {
        // Checkbox değiştiğinde kontrolEt fonksiyonunu çağır
        kontrolEt();
    });


    $(document).ready(function () {
        $("#submit").click(function () {
            var selectedValues = [];
            $("#ckb:checked").each(function () {
                selectedValues.push($(this).val());
            });
            $.ajax({
                type: "POST",
                url: "/Fit/Print",
                headers: { "RequestVerificationToken": gettoken() },
                data: JSON.stringify(selectedValues.map(Number)),
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (response.success) {
                        var images = response.data;
                        mergeImages(images);
                    }
                    else {
                        alert(response.message);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(gettoken());
                    console.error(error);
                }

            });
        });
    });

    
    function mergeImages(images) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.id = "canvas"

        var ppi = 227; // Sabit PPI değeri
        var cmToPixel = ppi / 2.54; // 1 santimetre kaç piksele denk geliyor

        // A4 boyutlarını piksele dönüştürme (landscape mod)
        var marginCm = 1; // 1 cm margin
        var widthCm = 29.7 - 2 * marginCm; // A4 genişliği cm cinsinden (margin dahil)
        var heightCm = 21 - 2 * marginCm; // A4 yüksekliği cm cinsinden (margin dahil)

        var width = widthCm * cmToPixel; // Genişlik piksel cinsinden
        var height = heightCm * cmToPixel; // Yükseklik piksel cinsinden

        var imageHeight = height / images.length - cmToPixel * 0.1; // Her bir resim için yükseklik (1mm = 0.1cm beyaz çizgi)

        // Kanvas boyutunu ayarlama
        canvas.width = width + 2 * marginCm * cmToPixel;
        canvas.height = height + 2 * marginCm * cmToPixel + (images.length - 1) * cmToPixel * 0.1;

        // Arkaplanı beyaz yap
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var offsetY = marginCm * cmToPixel;

        images.forEach(function(imageUrl, index) {
            var img = new Image();
            img.src = "img/" + imageUrl;
            img.onload = function() {
                ctx.drawImage(img, marginCm * cmToPixel, offsetY, width, imageHeight);
                if (index < images.length - 1) {
                    offsetY += imageHeight + cmToPixel * 0.01; // Beyaz çizgi yüksekliği
                } else {
                    var blob = dataURItoBlob(canvas.toDataURL('image/png'));
                    var url = URL.createObjectURL(blob);
                    var newWindow = window.open(url, '_blank');
                    
                    // CSS Stillerini tanımlayın
                    var styles = `
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: #000000;
                        }
                        img {
                            border: 5px solid #ccc;
                        }
                    `;

                    // Yeni sayfaya stil bloğu ekleyin
                    newWindow.onload = function() {
                        var styleSheet = newWindow.document.createElement("style");
                        styleSheet.type = "text/css";
                        styleSheet.innerText = styles;
                        newWindow.document.head.appendChild(styleSheet);
                    };

                    newWindow.document.write('<img src="' + url + '" />');
                    newWindow.document.close();
                    newWindow.focus();
                }
            };
        });
    }

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
    }