import { useState } from 'react'
import { isObject, isArray, isUndefined } from '../util'

// cleared state
const defaultStateCleared = { loaded: true, count: 0, records: [], indexes: {} }
// default reseted state
const defaultState = { loaded: false, count: 0, records: [], indexes: {} }
// default beforeFn
const defaultBeforeFn = r => r

// unique removal
const processNewRecords = (unique, indexes, recordOrRecords) => {
	const recordsToAdd = isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords]

	// return when not unique
	if(!unique)
		return recordsToAdd;

	// filter out records that we already have in the collection
	return recordsToAdd.filter(r => !indexes.hasOwnProperty(r.id));
}

// create indexes
const createIndexes = (records) => {
	const table = {};
	for(let i = 0, len = records.length; i < len; i++){
		table[records[i].id] = i;
	}
	return table;
}


export const useCollection = (params) => {
	const [state, setState] = useState(defaultState);

	// controls unique records (and removes duplicates if exists)
	const unique = params?.unique === true;

	/**
	 * returns index of record with id
	 */
	const getIndex = (id) => state.indexes[id];

	/**
	 * returns record by id from collection
	 */
	const getById = (id) => state.records[getIndex(id)];

	/**
	 * updates the collection records
	 * @param records = array
	 */
	const update = (records) => setState({
		indexes: createIndexes(records),
		records,
		count: records.length,
		loaded: true
	})

	/**
	 * resets the collection and reset also loading state
	 */
	const reset = () => setState(defaultState)

	/**
	 * clears the collection, but loading state stays
	 */
	const clear = () => setState(defaultStateCleared)

	/**
	 * adds new element to the collection
	 * @param record = object
	 * @param beforeFn = optional fn to transform
	 * @param insertToBegin = insert to the beginning of the collection
	 */
	const add = (record, beforeFn, insertToBegin) => setState(oldState => {
		const recordsToAdd = processNewRecords(unique, oldState.indexes, record);
		const newRecords = insertToBegin ? recordsToAdd.concat(oldState.records) : oldState.records.concat(recordsToAdd);

		return (beforeFn || defaultBeforeFn)({
			records: newRecords,
			count: oldState.count + recordsToAdd.length,
			loaded: oldState.loaded,
			indexes: createIndexes(newRecords)
		})
	})

	/**
	 * insert elements to the beginning of the array
	 */
	const prepend = (record, beforeFn) => add(record, beforeFn, true)

	/**
	 * removes element from collection
	 * @param id = integer
	 */
	const remove = id => setState(oldState => {
		// state may be async, we need to use oldState
		const _idx = oldState.indexes[id];
		// record not found
		if(isUndefined(_idx)){
			return oldState;
		}

		// remove element with index
		oldState.records.splice(_idx, 1);

		// returning same state within new array is much faster
		return {
			records: oldState.records,
			count: oldState.count - 1,
			loaded: oldState.loaded,
			indexes: createIndexes(oldState.records)
		};
	})

	/**
	 * updates single record inside collection
	 * @param id = record id
	 * @param data = object
	 * @param replaceData = replace record's data instead of concating
	 */
	const updateRecord = (id, data, replaceData) => {
		if(!isObject(data)){
			return false;
		}

		setState(oldState => {
			let records = oldState.records,
				idx = oldState.indexes[id];

			//console.log('STORE find', id, 'found idx', idx, 'records', oldState.records, 'update with', data);

			// not found
			if(isUndefined(idx))
				return oldState;

			//console.log('STORE', records[idx], data);
			records[idx] = replaceData === true ? data : {...records[idx], ...data};
			return {
				records,
				count: oldState.count,
				loaded: oldState.loaded,
				indexes: oldState.indexes
			}
		})
	}

	const updateAll = (data, replaceData) => {
		if(!isObject(data)){
			return false;
		}

		setState(oldState => {
			let records = oldState.records;
			for(let i = 0, len = records.length; i < len; i++){
				records[i] = replaceData === true ? data : {...records[i], ...data};
			}
			return {
				records,
				count: oldState.count,
				loaded: oldState.loaded,
				indexes: oldState.indexes
			}
		});
	}

	/**
	 * replaces single record with new state inside collection
	 * @param id = record id
	 * @param data = new object to be set
	 */
	const replaceRecord = (id, data) => updateRecord(id, data, true)
	const replaceAll = (data) => updateAll(data, true);

	return {
		state,
		setState,
		getIndex,
		getById,
		update,
		reset,
		clear,
		add,
		prepend,
		remove,
		updateRecord,
		updateAll,
		replaceRecord,
		replaceAll
	}
};