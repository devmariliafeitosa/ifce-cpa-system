const ACTION_PATTERN = /^[A-Z_]+: /;

function buildAction(action, description, date = new Date()) {
	if (typeof action !== 'string' || !/^[A-Z_]+$/.test(action.trim())) {
		throw new TypeError('Action should have only upper and lowercase chars');
	}

	if (typeof description !== 'string' || !description.trim()) {
		throw new TypeError('description required');
	}

	const timestamp = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(timestamp.getTime())) throw new TypeError('timestamp invalid');

	return `${action.trim()}: ${description.trim()} - ${timestamp.toISOString()}`;
}

function isValidAction(value) {
    if (typeof value !== 'string' || !ACTION_PATTERN.test(value)) return false;
	
    const separatorIndex = value.lastIndexOf(' - ');
	
    return separatorIndex > value.indexOf(': ') && separatorIndex < value.length - 3;
}

module.exports = { buildAction, isValidAction };
