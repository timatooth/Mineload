/* Minecraft-Avatars: Draw a representation of a Minecraft skin using
 * JavaScript.
 *
 * https://github.com/ion1/minecraft-avatars
 *
 * Copyright © 2012 Johan Kiviniemi. Licensed under the ISC license.
 * https://github.com/ion1/minecraft-avatars/blob/master/COPYING
 */

/*global window */

(function($) {
    'use strict';

    var headW = 8,
            headH = 8,
            headSX = 8,
            headSY = 8,
            hatW = headW,
            hatH = headH,
            hatSX = 40,
            hatSY = headSY,
            bodyW = 8,
            bodyH = 12,
            bodySX = 20,
            bodySY = 20,
            armW = 4,
            armH = bodyH,
            armSX0 = 44, // Front
            armSX1 = armSX0 + 2 * armW, // Back
            armSY = bodySY,
            legW = 4,
            legH = bodyH,
            legSX0 = 4,
            legSX1 = legSX0,
            legSY = bodySY,
            width = 4 + armW + bodyW + armW,
            height = 4 + headH + bodyH + legH;

    function hasAlpha(img) {
        // FIXME: Figure out a good way to test whether the image has an alpha
        // channel.

        try {
            // This doesn’t work in most browsers. We don’t have access to the
            // pixel data in a tainted canvas.
            // https://developer.mozilla.org/en/CORS_Enabled_Image#What_is_a_.22tainted.22_canvas.3F

            // The head accessory is contained within this area.
            var hatX = 32,
                    hatY = 0,
                    hatW = 32,
                    hatH = 8,
                    tempCtx,
                    data,
                    i,
                    xTL,
                    xTR,
                    y,
                    aTL,
                    aTR;

            tempCtx = $('<canvas/>').
                    attr({width: hatW, height: hatH}).
                    get(0).
                    getContext('2d');
            tempCtx.drawImage(img, hatX, hatY, hatW, hatH, 0, 0, hatW, hatH);
            data = tempCtx.getImageData(0, 0, hatW, hatH).data;

            // Traverse the area diagonally starting from the top left and the
            // top right corners. If any of the pixels is translucent, the
            // image has an alpha channel.
            for (i = 0; i < Math.max(hatW, hatH); i = i + 1) {
                xTL = i % hatW;
                xTR = ((-i - 1) % hatW + hatW) % hatW;
                y = i % hatH;
                aTL = data[(hatW * y + xTL) * 4 + 3];
                aTR = data[(hatW * y + xTR) * 4 + 3];

                if (aTL < 255 || aTR < 255) {
                    return true;
                }
            }
        } catch (e) {
        }
        return false;
    }

    function drawAvatar(ctx, img) {
        //                 sx      sy      sw     sh     dx                dy                 dw     dh
        ctx.drawImage(img, headSX, headSY, headW, headH, 2 + armW, 2, headW, headH);
        if (hasAlpha(img)) {
            ctx.drawImage(img, hatSX, hatSY, hatW, hatH, 2 + armW, 2, hatW, hatH);
        }
        ctx.drawImage(img, armSX0, armSY, armW, armH, 2, 2 + headH, armW, armH);
        ctx.drawImage(img, bodySX, bodySY, bodyW, bodyH, 2 + armW, 2 + headH, bodyW, bodyH);
        ctx.drawImage(img, armSX1, armSY, armW, armH, 2 + armW + bodyW, 2 + headH, armW, armH);
        ctx.drawImage(img, legSX0, legSY, legW, legH, 2 + armW, 2 + headH + bodyH, legW, legH);
        ctx.drawImage(img, legSX1, legSY, legW, legH, 2 + armW + legW, 2 + headH + bodyH, legW, legH);
    }

    function drawOutlinePath(ctx, o) {
        ctx.beginPath();
        ctx.moveTo(2 + armW - o, 2 - o);
        ctx.lineTo(2 + armW + bodyW + o, 2 - o);
        ctx.lineTo(2 + armW + bodyW + o, 2 + headH - o);
        ctx.lineTo(2 + armW + bodyW + armW + o, 2 + headH - o);
        ctx.lineTo(2 + armW + bodyW + armW + o, 2 + headH + bodyH + o);
        ctx.lineTo(2 + armW + bodyW + o, 2 + headH + bodyH + o);
        ctx.lineTo(2 + armW + bodyW + o, 2 + headH + bodyH + legH + o);
        ctx.lineTo(2 + armW - o, 2 + headH + bodyH + legH + o);
        ctx.lineTo(2 + armW - o, 2 + headH + bodyH + o);
        ctx.lineTo(2 - o, 2 + headH + bodyH + o);
        ctx.lineTo(2 - o, 2 + headH - o);
        ctx.lineTo(2 + armW - o, 2 + headH - o);
        ctx.closePath();
    }
    function drawOutline(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        drawOutlinePath(ctx, 1);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        drawOutlinePath(ctx, 0);
        ctx.fill();
    }

    function playerUri(player) {
        var uri;
        if (!player || player.length === 0) {
            uri = 'http://www.minecraft.net/images/char.png';
        } else {
            uri = 'http://s3.amazonaws.com/MinecraftSkins/' + player + '.png';
        }
        return uri;
    }

    function loadAvatar(par, settings) {
        par = $(par);

        var uri = playerUri(settings.player),
                canvas = $('<canvas class="minecraft-avatar-canvas"/>').
                attr({width: width, height: height}),
        canvasElem = canvas.get(0),
                ctx = canvasElem.getContext('2d'),
                img = new window.Image();

        drawOutline(ctx);

        img.onload = function() {
            drawAvatar(ctx, img);
            settings.onLoad(canvasElem);
        };
        img.onerror = function() {
            var imgD = new window.Image();
            imgD.onerror = settings.onError;
            imgD.onload = function() {
                drawAvatar(ctx, imgD);
                settings.onLoad(canvasElem);
            };
            imgD.src = playerUri();
        };
        img.src = uri;

        $(par).empty().append(canvas);
        settings.onCreate(canvasElem);
    }

    $.fn.minecraftAvatar = function(options) {
        this.each(function() {
            var defaults = {
                player: $(this).attr('data-player'),
                onError: function() {
                },
                onCreate: function() {
                },
                onLoad: function() {
                }
            };

            loadAvatar(this, $.extend(defaults, options));
        });
    };
}(window.jQuery));