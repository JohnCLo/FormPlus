/* ===========================================================
 * bootstrap-fileupload.js j2
 * http://jasny.github.com/bootstrap/javascript.html#fileupload
 * ===========================================================
 * Copyright 2012 Jasny BV, Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_

 /* INPUTMASK PUBLIC CLASS DEFINITION
  * ================================= */

  var Fileupload = function (element, options) {
    this.$element = $(element)
    this.type = this.$element.data('uploadtype') || (this.$element.find('.thumbnail').length > 0 ? "image" : "file")
      
    this.$input = this.$element.find(':file')
    if (this.$input.length === 0) return

    this.name = this.$input.attr('name') || options.name

    this.$hidden = this.$element.find(':hidden[name="'+this.name+'"]')
    if (this.$hidden.length === 0) {
      this.$hidden = $('<input type="hidden" />')
      this.$element.prepend(this.$hidden)
    }

    this.$preview = this.$element.find('.fileupload-preview')
    var height = this.$preview.css('height')
    if (this.$preview.css('display') != 'inline' && height != '0px' && height != 'none') this.$preview.css('line-height', height)

    this.$remove = this.$element.find('[data-dismiss="fileupload"]')

    this.$element.find('[data-trigger="fileupload"]').on('click.fileupload', $.proxy(this.trigger, this))

    this.listen()
  }
  
  Fileupload.prototype = {
    
    listen: function() {
      this.$input.on('change.fileupload', $.proxy(this.change, this))
      if (this.$remove) this.$remove.on('click.fileupload', $.proxy(this.clear, this))
    },
    
    change: function(e, invoked) {
      var file = e.target.files !== undefined ? e.target.files[0] : (e.target.value ? { name: e.target.value.replace(/^.+\\/, '') } : null)
      if (invoked === 'clear') return
      
      if (!file) {
        this.clear()
        return
      }
      
      this.$hidden.val('')
      this.$hidden.attr('name', '')
      this.$input.attr('name', this.name)

      if (this.type === "image" && this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match('image.*') : file.name.match('\\.(gif|png|jpe?g)$')) && typeof FileReader !== "undefined") {
        var reader = new FileReader()
        var preview = this.$preview
        var element = this.$element

        reader.onload = function(e) {
          preview.html('<img id="scream" src="' + e.target.result + '" ' + (preview.css('max-height') != 'none' ? 'style="max-height: ' + preview.css('max-height') + ';"' : '') + ' />')
          element.addClass('fileupload-exists').removeClass('fileupload-new')
          var canvas = document.createElement("canvas"),
              context = canvas.getContext("2d"),
              image = new Image();

          image.onload = function () {
              var img = this,
                  width = img.width,
                  height = img.height;

              canvas.width = 300; //main variable
              canvas.height = 300; //main variable

              var fz; // for horizontal images fz= factorheight, vertical fz= factorwidth
              var fx; // for horizontal images fx= factorwidth, vertical fx= 0
              var fy; // for horizontal images fy= 0, vertical fy = factorheight

              // if horizontal image
              if (width > height){
                fz = canvas.height / height;
                fy = 0;

                if (fz > 1){
                  fx = (canvas.width - (width * fz))/2;
                }
                else if (fz < 1) {
                  fx = (canvas.width - (width * fz));
                }
                else {
                  fx = (canvas.width - (width * fz));
                }
                console.log(fz);
                console.log(fx);
                console.log(fy);
              }
              // if vertical image
              else if (width < height) {
                fz = canvas.width / width;
                fx = 0;

                if (fz > 1){
                  fy = (canvas.height - (height * fz))/4;
                }
                else if (fz < 1) {
                  fy = (canvas.height - (height * fz));
                }
                else {
                  fy = (canvas.height - (height * fz));
                }
                console.log(fz);
                console.log(fx);
                console.log(fy);
              }
              // if square image
              else {
                fz= canvas.height / height;
                fx = 0;
                fy = 0;
              }

              context.scale(fz, fz);
              context.drawImage(img, fx, fy);
              var base64 = canvas.toDataURL();
              //console.log(base64);

              //Send to Google Form
              $('#entry_6').val(base64);

              // Uncomment below if you want resized image to reveal (for error testing)
              //document.body.appendChild(canvas);
          };
          image.src = e.target.result;

        }
        reader.readAsDataURL(file)
      } else {
        this.$preview.text(file.name)
        this.$element.addClass('fileupload-exists').removeClass('fileupload-new')
      }
    },

    clear: function(e) {
      this.$hidden.val('')
      this.$hidden.attr('name', this.name)
      this.$input.attr('name', '')
      this.$input.val('') // Doesn't work in IE, which causes issues when selecting the same file twice

      this.$preview.html('')
      this.$element.addClass('fileupload-new').removeClass('fileupload-exists')

      if (e) {
        this.$input.trigger('change', [ 'clear' ])
        e.preventDefault()
      }
    },
    
    trigger: function(e) {
      this.$input.trigger('click')
      e.preventDefault()
    }
  }

  
 /* INPUTMASK PLUGIN DEFINITION
  * =========================== */

  $.fn.fileupload = function (options) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('fileupload')
      if (!data) $this.data('fileupload', (data = new Fileupload(this, options)))
    })
  }

  $.fn.fileupload.Constructor = Fileupload


 /* INPUTMASK DATA-API
  * ================== */

  $(function () {
    $('body').on('click.fileupload.data-api', '[data-provides="fileupload"]', function (e) {
      var $this = $(this)
      if ($this.data('fileupload')) return
      $this.fileupload($this.data())
      
      var $target = $(e.target).parents('[data-dismiss=fileupload],[data-trigger=fileupload]').first()
      if ($target.length > 0) {
          $target.trigger('click.fileupload')
          e.preventDefault()
      }
    })
  })

}(window.jQuery)
