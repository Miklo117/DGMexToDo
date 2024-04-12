/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

const Idiomas = {
  ESP: 1,
  ING: 2,
};

class Idioma extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const hStyle = { color: 'orange', cursor: 'pointer', fontSize: '14px' };
    const hStyle2 = { color: 'white', cursor: 'pointer', fontSize: '14px' };
    const StyleInline = { float: 'left', display: 'flex' };
    let element;
    if (this.props.claIdioma == Idiomas.ING) {
      element = (
        <a className="nav-link pr-0" role="button" aria-haspopup="true" aria-expanded="true">
          <div style={StyleInline}>
            <span
              className="WebLabelCtrl mb-0 "
              style={hStyle2}
              onClick={(e) => {
                if (this.props.onChangeIdiomaCallback) {
                  this.props.onChangeIdiomaCallback(1);
                  e.preventDefault();
                }
              }}
            >
              ESP
            </span>
            &nbsp;<span style={{ color: 'white' }}>/</span>&nbsp;
            <span
              className="WebLabelCtrl mb-0"
              style={hStyle}
              onClick={(e) => {
                if (this.props.onChangeIdiomaCallback) {
                  this.props.onChangeIdiomaCallback(2);
                  e.preventDefault();
                }
              }}
            >
              ENG
            </span>
          </div>
        </a>
      );
    } else {
      element = (
        <a className="nav-link pr-0" role="button" aria-haspopup="true" aria-expanded="true">
          <div style={StyleInline}>
            <span
              className="WebLabelCtrl mb-0"
              style={hStyle}
              onClick={(e) => {
                if (this.props.onChangeIdiomaCallback) {
                  this.props.onChangeIdiomaCallback(1);
                  e.preventDefault();
                }
              }}
            >
              ESP
            </span>
            &nbsp;<span style={{ color: 'white' }}>/</span>&nbsp;
            <span
              className="WebLabelCtrl mb-0"
              style={hStyle2}
              onClick={(e) => {
                if (this.props.onChangeIdiomaCallback) {
                  this.props.onChangeIdiomaCallback(2);
                  e.preventDefault();
                }
              }}
            >
              ENG
            </span>
          </div>
        </a>
      );
    }

    return <>{element}</>;
  }
}

export default Idioma;
