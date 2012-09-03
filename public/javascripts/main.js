
$(document).ready(setup);

function setup() {
  $("#tabs").tabs({
    show: function(event, ui) {
      switch(ui.panel.id) {
        case "tabs-1":
          $('input#products').focus();

          $('#common-products').hide();
          $('#common-ingredients').show();

          break;
        case "tabs-2":
          $("input#ingredients").focus();

          $('#common-ingredients').hide();
          $('#common-products').show();

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
    if (window[elemId].indexOf(entryToAdd) === -1) {
      return;
    }
    $('table#'+elemId+' > tbody:last').append( getRowHTML(elemId, entryToAdd) );
    $("button.remove").button();
    updateCommonIngredients(elemId);
    $entryInput.val('').focus();
  }

  function getRowHTML(tdClassName, tdContent) {
    return '<tr><td class="'+tdClassName+'">'+tdContent+'</td><td class="remove"><button class="remove">Remove</button></td></tr>';
  }

  var twoTables = $("table#products").add($("table#ingredients"));
  twoTables.delegate("button.remove", "click", function() {
    var tableId = $(this).closest('table').attr('id');

    var $thisRow = $(this).parent().parent();
    $thisRow.remove();

    updateCommonIngredients(tableId);

    $("input#" + tableId).focus();
  });

  function updateCommonIngredients(elemId) {
    var tableToInsertIntoElemId = (elemId === 'products') ? 'ingredients' : 'products';
    $('table#common-'+tableToInsertIntoElemId+' tr:gt(0)').remove();

    var selectedEntries = [];

    $('table#'+elemId+' tr td.'+elemId).each(function() {
      var entry = $(this).text();
      selectedEntries.push(entry);
    });

    var associatedEntriesSets = [];
    for (var i=0; i < selectedEntries.length; i++) {
      var selectedEntry = selectedEntries[i];

      var associatedEntries;
      if (elemId === "products") {
        associatedEntries = productIngredients[selectedEntry];
      } else if (elemId === "ingredients") {
        associatedEntries = ingredientProducts[selectedEntry];
      }
      associatedEntriesSets.push(associatedEntries);
    }

    if (associatedEntriesSets.length === 0) {
      return;
    }

    var commonEntries = _.intersection.apply(_, associatedEntriesSets);
    for (var i=0; i < commonEntries.length; i++) {
      var commonEntry = commonEntries[i];
      $('table#common-'+tableToInsertIntoElemId+' > tbody:last').append('<tr><td>'+commonEntry+'</td></tr>');
    }
  }
}