
$(document).ready(setup);

function setup() {
  $("#tabs").tabs({
    show: function(event, ui) {
      switch(ui.panel.id) {
        case "tabs-1":
          $("input#products").focus();
          break;
        case "tabs-2":
          $("input#ingredients").focus();
          break;
      }
    }
  });

  // Products.
  $("input#products").autocomplete({
    source: products
  })
  .keydown(function(evt) {
    switch (evt.keyCode) {
      case 13:
        addEntry( $(this).attr('id') );
        return false;
    }
    return;
  });

  $("button#add-product").button();
  $("button#add-product").click(function() {
    addEntry("products");
  });

  // Ingredients.
  $("input#ingredients").autocomplete({
    source: ingredients
  })
  .keydown(function(evt) {
    switch (evt.keyCode) {
      case 13:
        addEntry( $(this).attr('id') );
        return false;
    }
    return;
  });

  $("button#add-ingredient").button();
  $("button#add-ingredient").click(function() {
    addEntry("ingredients");
  });

  function addEntry(elemId) {
    var $entryInput = $("input#"+elemId);
    var entryToAdd = $entryInput.val();
    $('table#'+elemId+' > tbody:last').append( getRowHTML(elemId, entryToAdd) );
    $("button.remove").button();
    $entryInput.val('').focus();
  }

  function getRowHTML(tdClassName, tdContent) {
    return '<tr><td class="'+tdClassName+'">'+tdContent+'</td><td class="remove"><button class="remove">Remove</button></td></tr>';
  }

  $("table").delegate("button.remove", "click", function() {
    var tableId = $(this).closest('table').attr('id');

    var $thisRow = $(this).parent().parent();
    $thisRow.remove();

    
    $("input#" + tableId).focus();
  });
}