function Validator(option) {
  var selectorRules = {};

  //Hàm thực hiện validate
  function validate(inputElement, rule) {
    var error;
    var errorElement = inputElement.parentElement.querySelector(option.errorMessage);
    //lấy ra các rule của selector
    var rules = selectorRules[rule.selector];
    //lặp qua các rule & kiểm tra
    //nếu có lỗi thi dừng việcviệc kiểm tra
    for (var i = 0; i < rules.length; i++) {
      error = rules[i](inputElement.value);
      if (error) {
        break;
      }
    }
    if (error) {
      errorElement.innerText = error;
      inputElement.parentElement.classList.add('invalid');
    } else {
      errorElement.innerText = '';
      inputElement.parentElement.classList.remove('invalid');
    }
  }

  //lấy element của form cần validate
  var formElement = document.querySelector(option.form);
  if (formElement) {
    formElement.onsubmit = function (event) {
      event.preventDefault();
      //Thực hiện lặp qua từng rule và validate trước
      option.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        validate(inputElement, rule);
      })
    };
    //Lặp qua mỗi rule và xử lý (blur, input, ...)
    option.rules.forEach(rule => {
      var inputElement = formElement.querySelector(rule.selector);

      //Lưu lại cái rule cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      if (inputElement) {
        //Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        }
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector('.form-message');
          errorElement.innerText = '';
          inputElement.parentElement.classList.remove('invalid');
        }
      }
    });
  }
}

//Định nghĩ rules
//Nguyên tắc của các rule:
// 1. Khi có lỗi => Trả về message lỗi
// 2. Khi không có lỗi => Không trả cái gì cả (undefined)
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test(value) {
      return value.trim() ? undefined : message || 'Vui lòng nhập trường này!!!'
    }
  }
}
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test(value) {
      var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return reg.test(value) ? undefined : message || 'Vui lòng nhập email';
    }
  }
}
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test(value) {
      return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
    }
  }
}
Validator.isConfirmed = function (selector, getConfỉrm, message) {
  return {
    selector: selector,
    test(value) {
      return value === getConfỉrm() ? undefined : message || 'Giá trị nhập vào không chính xác';
    }
  }
}
Validator();
