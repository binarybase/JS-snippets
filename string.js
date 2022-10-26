import { isEmpty, isString } from '../util';

export function capitalize(s){
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export function sanitize(s){
	return s.replace(/[\u200B\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '');
}

export function isWhitespace(s){
	return isEmpty(s) || s.replace(/\t\n\r\s/g, '').length == 0;
}

export function isAscii(s){
	return !/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi.test(s);
}

export function passwordMinRequirements(s){
	return !isEmpty(s) && s.length >= 6 && /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s);
}

export function trimString(s, len){
	len = len || 70;

	if(!isString(s) || isEmpty(s) || len < 3)
		return '';

	if(s.length > len){
		return s.substring(0, len - 3) + '...';
	}

	return s;
}