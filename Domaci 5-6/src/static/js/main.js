$(document).ready(function() {
    $('#pretraga').keyup(function() {
        search_table($(this).val(), $('#glavna_tabela tr'));
    })

    function search_table(txt, tabela) {
        tabela.each(function() {
            $(this).each(function() {
                if($(this).text().toLowerCase().indexOf(txt.toLowerCase()) >= 0) 
                {
                    $(this).show().css("background", "#00498D");
                }
                else 
                {
                    $(this).hide();
                }
            });
        });
        $("tr:visible:even").css("background", "#033c72");
    }

    $(".link").click(function(e) 
    { 
        var text = $(this).text();
        var t = $("#modal_tabela");
        if($(this).hasClass("predavac")) 
        {
            $("caption", t).html("Raspored za predavača: <b>" + text + "</b>");
            $("th.ucionica, td.ucionica", t).show();
            $("th.predavac, td.predavac", t).hide();
        }
        else if($(this).hasClass("ucionica")) 
        {
            $("caption", t).html("Raspored za učionicu: <b>" + text + "</b>");
            $("th.predavac, td.predavac", t).show();
            $("th.ucionica, td.ucionica", t).hide();
        }
        search_table(text, $('tr', t));
        $(".wrap").show();
        $(t).css("display","block");
        $("tr:visible:even", t).css("background", "#033c72");
    });

    $(".wrap").click(function(e) {
        $(this).hide();
        $("#modal_tabela").hide();
    });
});
