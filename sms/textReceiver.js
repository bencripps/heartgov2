/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:16:46
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-12 22:12:16
*/

/*jslint node: true */

module.exports = function(mongoose, idGenerator, schemas, messageConfig) {
    'use strict';
    
    var textReceiver = {
        handleResponse: function(message, twilioWrapper) {

            if (this.user.hasTrackingNumber(message.body)) {
                this.utils.findText('textInformation.trackingNumber', this.utils.getId(message.body)).then(this.responder.withTrackingNumber.bind(this, message, twilioWrapper));
            }

            else {
                this.user.isNewOrOldTexter(message.from).then(this.responder.withoutTrackingNumber.bind(this, message, twilioWrapper));
            }
        },
        responder: {
            withTrackingNumber: function(message, twil, data, err) {

                if (data.length >= 1) {
                    textReceiver.message.save(message, 'getTextModel', textReceiver.utils.getId(message.body));
                    twil.sendOutGoingText(messageConfig.textResponses.trackingNumberFound, message.from);
                }

                else if (err) { textReceiver.utils.errorOccured(err); }

                else {
                    textReceiver.message.save(message, 'getTextModel');
                    twil.sendOutGoingText(messageConfig.textResponses.trackingNumberNotFound, message.from);
                }
            },
            withoutTrackingNumber: function(message, twil, data, err) {

                if (err) { textReceiver.utils.errorOccured(err); }

                else {

                    if ( data.length >= 1) {
                        textReceiver.message.save(message, 'getTextModel');
                        twil.sendOutGoingText(messageConfig.textResponses.repeatTexter, message.from);   
                    }

                    else {
                        textReceiver.message.save(message, 'getTextModel');
                        twil.sendOutGoingText(textReceiver.user.newToSiteResponse(), message.from);
                    }
                }
            }
        },
        user: {
            newToSiteResponse: function() {
                return messageConfig.textResponses.firstTexter + messageConfig.textResponses.listCategories + textReceiver.utils.listCategories(messageConfig.categories);
            },
            hasTrackingNumber: function(body) {
                var test = textReceiver.utils.idRegex(body),
                    isCorrect = test && textReceiver.utils.getId(body).length === 8;

                return isCorrect;
            },
            isNewTexter: function(from) {
                return true;
            },
            isRepeatTexter: function(from){
                var userNumberFound = textReceiver.utils.findText('userInformation.phoneNumber.string', from);
                return userNumberFound;
            },
            isNewOrOldTexter: function(from) {
                return textReceiver.utils.findText('userInformation.phoneNumber.string', from);
            }
        },
        message: {
            isNotFormattedCorrectly: function() {

            },
            isCorrectlyFormatted: function() {

            },
            save: function(message, method, assocciatedTrackingNumber) {
                var info = textReceiver.utils[method](message, assocciatedTrackingNumber),
                    model = new schemas.text(info);

                model.save();
            },
            delete: function() {

            }
        },
        utils: {
            idRegex: function(body) {
                return /#/.exec(body);
            },
            getCategory: function(body) {
                var re = /\([0-4]\)/.exec(body);
                return re.input.substring(re.index + 2, re.index + 1);
            },
            mentionsCategory: function(body) {
                if (/\([0-4]\)/.exec(body)) return true;
            },
            getId: function(body) {
                var idRegex = this.idRegex(body);
                return idRegex.input.substring(idRegex.index + 1);
            },
            listCategories: function(cats) {
                return cats.map(function(a,b) {return b + 1 + ' ' + a;}).join(', ');
            },
            getTextModel: function(message, assocciatedTrackingNumber) {

                 return {
                    userInformation: {
                        userId: null,
                        name: null,
                        zipcode: null,
                        phoneNumber: {
                            string: message.from,
                            number: Number(message.from)
                        }
                    },
                    textInformation: {
                        category: {
                            id: textReceiver.utils.mentionsCategory(message.body) ? textReceiver.utils.getCategory(message.body): null,
                            name: textReceiver.utils.mentionsCategory(message.body) ? messageConfig.categories[textReceiver.utils.getCategory(message.body) - 1]: null,
                        },
                        body: message.body,
                        status: null,
                        zipcode: null,
                        responders: [],
                        lastResponder: [],
                        trackingNumber: assocciatedTrackingNumber || null,
                        searchable: message.body.split(' ')
                    }
                };
            },
            findText: function(key, value) {
                var obj = {};
                obj[key] = value;
                return schemas.text.find(obj).exec();
            },
            errorOccured: function(err) {
                console.log('Error occured!', err);
            }
        }
    };

    return textReceiver;
};