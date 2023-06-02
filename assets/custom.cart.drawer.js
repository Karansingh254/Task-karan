document.addEventListener('DOMContentLoaded', function() {
    var menuOpenElements = document.querySelectorAll('button.btn.product-form__cart-submit.btn--secondary-accent'); // Add to cart button
    var menuContextElements = document.querySelectorAll('.custom-cart-drawer,.custom-cart-drawer-close'); // Close button
    
  menuOpenElements.forEach(function(menuOpenElement) {
    menuOpenElement.addEventListener('touchend', toggleMenu);
    menuOpenElement.addEventListener('click', toggleMenu);
  });
    
  menuContextElements.forEach(function(menuContextElement) {
    menuContextElement.addEventListener('touchend', closeMenu);
    menuContextElement.addEventListener('click', closeMenu);
  });
  function toggleMenu(event) {
    var menu = this.getAttribute('data-menu');
    var menuElement = document.querySelector(menu);
    
    menuElement.classList.toggle('js-menu__expanded');
    menuElement.parentElement.classList.toggle('js-menu__expanded');
  }
 function closeMenu(event) {
    if (this.classList.contains('js-menu__context') || this.classList.contains('custom-cart-drawer-close')) {
      var expandedMenus = document.querySelectorAll('.js-menu__expanded');
      
      expandedMenus.forEach(function(expandedMenu) {
        expandedMenu.classList.remove('js-menu__expanded');
      });
    }
  }   
});
 
// On click of add to cart button product goes into cart
document.querySelector('button.btn.product-form__cart-submit.btn--secondary-accent').addEventListener('click', function() {
  var conceptName; // Declare conceptName variable outside the event listener
  conceptName = document.querySelector('button.btn.product-form__cart-submit.btn--secondary-accent').getAttribute('data-product-id');
  var qty = 1; // Assuming you have a variable qty declared somewhere
  if (conceptName === 'undefined') {
    conceptName = document.querySelector('.product-form__cart-submit').getAttribute('data-product-id');
  }
  var formData = {
    'items': [{
      'id': conceptName,
      'quantity': qty
    }]
  };

  fetch('cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {

    })
    .catch(function(error) {
    });
  setTimeout(() => {
    fetch('/cart.js')
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        var mappedData = result.items.map(function(item) {
          return {
            img: item.image,
            id: item.id,
            title: item.title,
            size: item.options_with_values[0].value,
            price: item.price,
            quantity: item.quantity
          };
        });

        // First time Adding data into cart drawer on click of add to cart
        var outputHtml = '';
        mappedData.forEach(function(item) {
          outputHtml += '<div class="new">';
          outputHtml += '<div class="img--cls"><img src="' + item.img + '"/></div>';
          outputHtml += '<div class="main--product-data">';
          outputHtml += '<div class="product-data">';
          outputHtml += '<h4 class="costom-title">' + item.title + '</h4>';
          // outputHtml += '<p class="costom-size"> ' + item.size + '</p>';
          outputHtml += '<p class="costom-price"> ' + '£' + (item.price / 100) + '</p>';
          // outputHtml += '<p class="costom-quantity"> ' + item.quantity + '</p>';
          outputHtml += '<p id="variantID" style="display: none;"> ' + item.id + '</p>';
          outputHtml += '</div>';
          outputHtml += '<div class="quantity--changer">';
          outputHtml += '<div class="quantity--selector">';
          outputHtml += '<button class="quantity__button btnqty qtyminus" value="' + item.id + '"  name="plus" type="button">' + '-' + '</button>';
          outputHtml += '<input value="' + item.quantity + '" value="' + item.id + '"  type="number" min="1" class="cart__quantity-selector qty-updates">';
          outputHtml += '<button class="quantity__button btnqty qtyplus" value="' + item.id + '"  name="minus" type="button">' + '+' + '</button>';
          outputHtml += '</div>';
          outputHtml += '<button class="cart_item_remove" value="' + item.id + '">remove</button>';
          outputHtml += '</div>';
          outputHtml += '</div>';
          outputHtml += '</div>';
        });

        // Append the HTML to a container element
        var cartItemsContainer = document.getElementById('cartItemsContainer');
        cartItemsContainer.innerHTML = outputHtml;
        var cartprice = result.items_subtotal_price;
        document.querySelector('.eee_price').textContent = '£' + (cartprice / 100);
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  }, 1000);
});

// On click of remove button, remove the cart Item
document.addEventListener('click', function(event) {
  if (event.target.matches('button.cart_item_remove')) {
    var cartLineId = event.target.getAttribute('value');
    var updateData = {};
    updateData[cartLineId] = 0;

    fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: updateData
      })
    });

    setTimeout(() => {
      fetch('/cart.js')
        .then(function(response) {
          return response.json();
        })
        .then(function(result) {
          // ON click of remove I have update the cart item
          var mappedData = result.items.map(function(item) {
            return {
              img: item.image,
              id: item.id,
              title: item.title,
              size: item.options_with_values[0].value,
              price: item.price,
              quantity: item.quantity
            };
          });

          // Output the mapped data to the HTML
          var outputHtml = '';

          mappedData.forEach(function(item) {
            outputHtml += '<div class="new">';
            outputHtml += '<div class="img--cls"><img src="' + item.img + '"/></div>';
            outputHtml += '<div class="main--product-data">';
            outputHtml += '<div class="product-data">';
            outputHtml += '<h4 class="costom-title">' + item.title + '</h4>';
            // outputHtml += '<p class="costom-size"> ' + item.size + '</p>';
            outputHtml += '<p class="costom-price"> ' + '£' + (item.price / 100) + '</p>';
            // outputHtml += '<p class="costom-quantity"> ' + item.quantity + '</p>';
            outputHtml += '<p id="variantID" style="display: none;"> ' + item.id + '</p>';
            outputHtml += '</div>';
            outputHtml += '<div class="quantity--changer">';
            outputHtml += '<div class="quantity--selector">';
            outputHtml += '<button class="quantity__button btnqty qtyminus"  value="' + item.id + '" name="plus" type="button">' + '-' + '</button>';
            outputHtml += '<input value="' + item.quantity + '"  value="' + item.id + '" type="number" min="1" class="cart__quantity-selector qty-updates">';
            outputHtml += '<button class="quantity__button btnqty qtyplus" value="' + item.id + '" name="minus" type="button">' + '+' + '</button>';
            outputHtml += '</div>';
            outputHtml += '<button class="cart_item_remove" value="' + item.id + '">remove</button>';
            outputHtml += '</div>';
            outputHtml += '</div>';
            outputHtml += '</div>';
          });

          // Append the HTML to a container element
          var cartItemsContainer = document.getElementById('cartItemsContainer');
          cartItemsContainer.innerHTML = outputHtml;

        })
        .catch(function(error) {
          console.error('Error:', error);
        });
    }, 1000);
  }
});

// On plus click, quantity change
document.addEventListener('click', function(event) {
  if (event.target.matches('button.quantity__button.btnqty.qtyplus')) {
    var cartLineId = event.target.getAttribute('value');
    var cart_change_qty = document.querySelector('input.cart__quantity-selector.qty-updates').value;

    var updateData = {};
    updateData[cartLineId] = cart_change_qty;

    fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: updateData
      })
    });

    setTimeout(() => {
      fetch('/cart.js')
        .then(function(response) {
          return response.json();
        })
        .then(function(result) {
          var mappedData = result.items.map(function(item) {
            return {
              img: item.image,
              id: item.id,
              title: item.title,
              size: item.options_with_values[0].value,
              price: item.price,
              quantity: item.quantity
            };
          });

          // Output the mapped data to the HTML
          var outputHtml = '';

          mappedData.forEach(function(item) {
            outputHtml += '<div class="new">';
            outputHtml += '<div class="img--cls"><img src="' + item.img + '"/></div>';
            outputHtml += '<div class="main--product-data">';
            outputHtml += '<div class="product-data">';
            outputHtml += '<h4 class="costom-title">' + item.title + '</h4>';
            // outputHtml += '<p class="costom-size"> ' + item.size + '</p>';
            outputHtml += '<p class="costom-price"> ' + '£' + (item.price / 100) + '</p>';
            // outputHtml += '<p class="costom-quantity"> ' + item.quantity + '</p>';
            outputHtml += '<p id="variantID" style="display: none;"> ' + item.id + '</p>';
            outputHtml += '</div>';
            outputHtml += '<div class="quantity--changer">';
            outputHtml += '<div class="quantity--selector">';
            outputHtml += '<button class="quantity__button btnqty qtyminus" name="plus" type="button">' + '-' + '</button>';
            outputHtml += '<input value="' + item.quantity + '" type="number" min="1" class="cart__quantity-selector qty-updates">';
            outputHtml += '<button class="quantity__button btnqty qtyplus" name="minus" type="button">' + '+' + '</button>';
            outputHtml += '</div>';
            outputHtml += '<button class="cart_item_remove" value="' + item.id + '">remove</button>';
            outputHtml += '</div>';
            outputHtml += '</div>';
            outputHtml += '</div>';
          });

          // Append the HTML to a container element
          var cartItemsContainer = document.getElementById('cartItemsContainer');
          cartItemsContainer.innerHTML = outputHtml;

        })
        .catch(function(error) {
          console.error('Error:', error);
        });
    }, 1000);
  }
});

// On minus click, quantity selector
document.addEventListener('click', function(event) {
  if (event.target.matches('button.quantity__button.btnqty.qtyminus')) {
    var cartLineId = event.target.getAttribute('value');
    console.log(cartLineId);
    var cart_change_qty = document.querySelector('input.cart__quantity-selector.qty-updates').value;

    var updateData = {};
    updateData[cartLineId] = cart_change_qty;

    fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: updateData
      })
    });

    setTimeout(() => {
      fetch('/cart.js')
        .then(function(response) {
          return response.json();
        })
        .then(function(result) {
          var mappedData = result.items.map(function(item) {
            return {
              img: item.image,
              id: item.id,
              title: item.title,
              size: item.options_with_values[0].value,
              price: item.price,
              quantity: item.quantity
            };
          });

          // Output the mapped data to the HTML
          var outputHtml = '';

          mappedData.forEach(function(item) {
            outputHtml += '<div class="new">';
            outputHtml += '<div class="img--cls"><img src="' + item.img + '"/></div>';
            outputHtml += '<div class="main--product-data">';
            outputHtml += '<div class="product-data">';
            outputHtml += '<h4 class="costom-title">' + item.title + '</h4>';
            // outputHtml += '<p class="costom-size"> ' + item.size + '</p>';
            outputHtml += '<p class="costom-price"> ' + '£' + (item.price / 100) + '</p>';
            // outputHtml += '<p class="costom-quantity"> ' + item.quantity + '</p>';
            outputHtml += '<p id="variantID" style="display: none;"> ' + item.id + '</p>';
            outputHtml += '</div>';
            outputHtml += '<div class="quantity--changer">';
            outputHtml += '<div class="quantity--selector">';
            outputHtml += '<button class="quantity__button btnqty qtyminus" name="plus" type="button">' + '-' + '</button>';
            outputHtml += '<input value="' + item.quantity + '" type="number" min="1" class="cart__quantity-selector qty-updates">';
            outputHtml += '<button class="quantity__button btnqty qtyplus" name="minus" type="button">' + '+' + '</button>';
            outputHtml += '</div>';
            outputHtml += '<button class="cart_item_remove" value="' + item.id + '">remove</button>';
            outputHtml += '</div>';
            outputHtml += '</div>';
            outputHtml += '</div>';
          });

          // Append the HTML to a container element
          var cartItemsContainer = document.getElementById('cartItemsContainer');
          cartItemsContainer.innerHTML = outputHtml;

        })
        .catch(function(error) {
          console.error('Error:', error);
        });
    }, 1000);
  }
});

