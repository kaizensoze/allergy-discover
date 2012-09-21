
$(document).ready(setup);

function renderTabs() {
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
}

function setup() {
  // Autocomplete.
  $("input#products").autocomplete({
    source: autocompleteProductSource,
    delay: 0,
    autoFocus: true
  });

  $("input#ingredients").autocomplete({
    source: autocompleteIngredientSource,
    delay: 0,
    autoFocus: true
  });

  $("input#products, input#ingredients").keydown(function(evt) {
    switch (evt.keyCode) {
      case 13:
        addEntry( $(this).attr('id') );
        return false;
    }
    return;
  });

  function autocompleteProductSource(req, responseFn) {
    autocompleteSource(req, responseFn, products);
  }

  function autocompleteIngredientSource(req, responseFn) {
    autocompleteSource(req, responseFn, ingredients);
  }

  function autocompleteSource(req, responseFn, dataSource) {
    var re = $.ui.autocomplete.escapeRegex(req.term);
    var matcher = new RegExp("^" + re, "i");
    var a = $.grep(dataSource, function(item, index) {
      return matcher.test(item);
    });
    responseFn(a);
  }

  // Add buttons.
  $("button#add-product").button();
  $("button#add-product").click(function() {
    addEntry("products");
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
    updateCommonTable(elemId);
    $entryInput.val('').focus();
  }

  function getRowHTML(tdClassName, tdContent) {
    return '<tr><td class="'+tdClassName+'-active"><input type="checkbox" name="'+tdClassName+'" checked/></td><td class="'+tdClassName+' active">'+tdContent+'</td><td class="remove"><button class="remove">Remove</button></td></tr>';
  }

  var twoTables = $("table#products").add($("table#ingredients"));
  twoTables
  .delegate("button.remove", "click", function() {
    var tableId = $(this).closest('table').attr('id');

    var $thisRow = $(this).parent().parent();
    $thisRow.remove();

    updateCommonTable(tableId);

    $("input#" + tableId).focus();
  }).delegate("input:checkbox", "click", function() {
    var checkboxName = $(this).attr('name');
    updateCommonTable(checkboxName);
  });

  function updateCommonTable(elemId) {
    var tableToInsertIntoElemId = (elemId === 'products') ? 'ingredients' : 'products';
    $('table#common-'+tableToInsertIntoElemId+' tr:gt(0)').remove();

    var selectedEntries = [];

    $('table#'+elemId+' tr td.'+elemId).each(function() {
      var $checkbox = $(this).prev().find('input');
      var entry = $(this).text();
      if ($checkbox.is(':checked')) {
        selectedEntries.push(entry);
      }
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

// For IE 7,8.
if(!Array.indexOf) {
  Array.prototype.indexOf = function(obj) {
    for (var i=0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}