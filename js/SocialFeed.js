/**
 * Social Feed
 * by kmturley
 */

/*global window, document*/

var SocialFeed = function () {
    'use strict';
    
    var module = {
        items: [],
        init: function (options) {
            var me = this;
            this.el = document.getElementById(options.id);
            
            // google plus
            this.load(options.google, function (data) {
                data = JSON.parse(data);
                me.add(data.items);
                me.render(me.items);
            });
            
            // twitter
            this.loadJSONP(options.twitter, function (data) {
                var i = 0,
                    el = document.createElement('div'),
                    items = [],
                    users = [],
                    profiles = [],
                    images = [],
                    dates = [],
                    titles = [];

                el.innerHTML = data.body;
                
                users = el.querySelectorAll('.p-name');
                profiles = el.querySelectorAll('.u-url');
                images = el.querySelectorAll('.u-photo');
                dates = el.querySelectorAll('.dt-updated');
                titles = el.querySelectorAll('.e-entry-title');
                
                for (i = 0; i < users.length; i += 1) {
                    items.push({
                        type: 'twitter',
                        actor: { displayName: users[i].innerHTML, image: { url: images[i].getAttribute('src') }, url: profiles[i].getAttribute('href') },
                        object: { content: titles[i].innerHTML },
                        published: dates[i].getAttribute('datetime'),
                        title: titles[i].innerHTML,
                        url: ''
                    });
                }
                me.add(items);
                me.render(me.items);
            });
            
            // facebook
            this.loadJSONP(options.facebook, function (data) {
                var i = 0,
                    items = [];
                
                for (i = 0; i < data.data.length; i += 1) {
                    items.push({
                        type: 'facebook',
                        actor: { displayName: data.data[i].from.name, image: { url: '' }, url: '' },
                        object: { content: data.data[i].message },
                        published: data.data[i].updated_time,
                        title: data.data[i].message,
                        url: ''
                    });
                }
                me.add(items);
                me.render(me.items);
            });
        },
        load: function (url, callback) {
            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        callback(xhr.responseText);
                    } else {
                        callback('error', xhr);
                    }
                }
            };
            xhr.send();
        },
        loadJSONP: function (url, callback) {
            var timestamp = 'callback' + new Date().getTime() + Math.round(Math.random() * 100),
                script = document.createElement('script');
            window[timestamp] = callback;
            script.src = url + '&callback=' + timestamp;
            document.getElementsByTagName('head')[0].appendChild(script);
        },
        add: function (items) {
            var i = 0;
            for (i = 0; i < items.length; i += 1) {
                this.items.push(items[i]);
            }
        },
        render: function (items) {
            var i = 0,
                html = '';
            items.sort(function (a, b) { return Date.parse(b.published) - Date.parse(a.published); });
            for (i = 0; i < items.length; i += 1) {
                html += '<li class="post">';
                html += '<img src="' + (items[i].actor.image.url || 'img/default.jpg') + '" alt="" class="image" />';
                html += '<img src="img/' + (items[i].type || 'google') + '.jpg" alt="" class="icon" />';
                html += '<div class="content"><h2><a href="' + items[i].actor.url + '" target="_blank">' + items[i].actor.displayName + '</a>';
                html += '<span class="time">' + this.timeSince(new Date(items[i].published).getTime()) + ' ago</span></h2>';
                html += '<p>' + items[i].object.content + '</p></div>';
                html += '</li>';
            }
            this.el.innerHTML = html;
        },
        timeSince: function (date) {
            var s = Math.floor((new Date() - date) / 1000),
                i = Math.floor(s / 31536000);
            if (i > 1) {
                return i + " years";
            }
            i = Math.floor(s / 2592000);
            if (i > 1) {
                return i + " months";
            }
            i = Math.floor(s / 86400);
            if (i > 1) {
                return i + " days";
            }
            i = Math.floor(s / 3600);
            if (i > 1) {
                return i + " hours";
            }
            i = Math.floor(s / 60);
            if (i > 1) {
                return i + " minutes";
            }
            return Math.floor(s) + " seconds";
        }
    };
    return module;
};