
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
  });
  $("button#add-product").button();
  $("button#add-product").click(function() {
    var $productsInput = $("input#products");
    var productToAdd = $productsInput.val();
    $('table#products > tbody:last').append( getRowHTML("product", productToAdd) );
    $("button.remove").button();
    $productsInput.val('').focus();
  });

  // Ingredients.
  $("input#ingredients").autocomplete({
    source: ingredients
  });
  $("button#add-ingredient").button();
  $("button#add-ingredient").click(function() {
    var $ingredientsInput = $("input#ingredients");
    var ingredientToAdd = $ingredientsInput.val();
    $('table#ingredients > tbody:last').append( getRowHTML("ingredient", ingredientToAdd) );
    $("button.remove").button();
    $ingredientsInput.val('').focus();
  });

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