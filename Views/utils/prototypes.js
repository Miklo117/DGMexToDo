/* eslint-disable no-extend-native */

String.prototype.isNullOrEmpty =
  String.prototype.isEmpty ||
  function () {
    return !this.trim().length;
  };

String.prototype.toSqlString =
  String.prototype.toSqlString ||
  function () {
    if (this.isEmpty()) {
      return ' null ';
    }

    return `'${this.replace("'", "''")}'`;
  };

String.prototype.toJsonString =
  String.prototype.toJsonString ||
  function () {
    return JSON.stringify(this);
  };

String.prototype.fromJSonString =
  Object.prototype.fromJSonString ||
  function () {
    return JSON.parse(this);
  };

String.prototype.isNumber =
  String.prototype.isNumber ||
  function () {
    let xValue = this.replace(',', '');
    xValue = this.replace('$', '');

    return !isNaN(xValue);
  };

String.prototype.toSqlNumber =
  String.prototype.toSqlNumber ||
  function () {
    let xValue = this;

    if (xValue.isEmpty()) {
      return ' null ';
    }

    if (xValue.isNumber()) {
      xValue = xValue.replace(',', '');
      xValue = xValue.replace('$', '');

      return xValue;
    }
  };

String.prototype.toFormatString =
  String.prototype.toFormatString ||
  function () {
    const d = new Date(this); // Date.parse(this);

    return `${[d.getDate().padLeft(), (d.getMonth() + 1).padLeft(), d.getFullYear()].join('/')} ${[
      (d.getHours() + 5).padLeft(),
      d.getMinutes().padLeft(),
      d.getSeconds().padLeft(),
    ].join(':')}`;
  };

Date.prototype.toSqlDateTime =
  Date.prototype.toSqlDateTime ||
  function () {
    const d = this;
    return `'${[d.getFullYear(), (d.getMonth() + 1).padLeft(), d.getDate().padLeft()].join('')} ${[
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
    ].join(':')}.${d.getMilliseconds()}'`;
  };

Number.prototype.padLeft = function (base, chr) {
  const len = String(base || 10).length - String(this).length + 1;
  return len > 0 ? new Array(len).join(chr || '0') + this : this;
};
