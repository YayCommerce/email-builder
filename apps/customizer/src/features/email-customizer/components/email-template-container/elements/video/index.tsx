import { CSSProperties, useMemo } from 'react';

import { ReactComponent as Play } from '@src/assets/svgs/play.svg';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const [DEFAULT_WIDTH, DEFAULT_HEIGHT] = [172, 172];
const VideoContent = ({ element }: ITemplateProps<'video'>) => {
  const data = element.data;

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      wordBreak: 'break-word',
      textAlign: 'center',
      backgroundColor: data.background_color || 'transparent',
      paddingTop: getDimensionValue(data.padding.top ?? 0),
      paddingRight: getDimensionValue(data.padding.right ?? 0),
      paddingBottom: getDimensionValue(data.padding.bottom ?? 0),
      paddingLeft: getDimensionValue(data.padding.left ?? 0),
    }),
    [data],
  );

  const tableStyle: CSSProperties = useMemo(
    () => ({
      display: 'table',
      borderCollapse: 'collapse',
      width: '100%',
      textAlign: 'center',
    }),
    [],
  );

  const thumbnailCellStyle: CSSProperties = useMemo(
    () => ({
      backgroundImage: data.src ? `url(${data.src})` : '',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: getDimensionValue(data.width ?? DEFAULT_WIDTH),
      height: getDimensionValue(data.height ?? DEFAULT_HEIGHT),
      textAlign: 'center',
      verticalAlign: 'middle',
      display: 'table-cell',
    }),
    [data.width, data.height, data.src],
  );

  const btnPlayStyle: CSSProperties = useMemo(
    () => ({
      fontSize: 14,
      fontWeight: 'bold',
      textDecoration: 'none',
      textTransform: 'capitalize',
      verticalAlign: 'middle',
      marginRight: 10,
      maxWidth: '100%',
      width: 56,
      height: 56,
      display: 'inline-block',
      border: 'none',
    }),
    [],
  );

  const anchorStyle: CSSProperties = useMemo(
    () => ({
      textDecoration: 'none',
      display: 'inline-block',
    }),
    [],
  );

  return (
    <ElementWrapper
      className="yaymail-customizer-element-video"
      element={element}
      style={wrapperStyles}
    >
      <table
        className="yaymail-customizer-element-video"
        role="presentation"
        border={0}
        align="center"
        cellPadding={0}
        cellSpacing={0}
        style={tableStyle}
      >
        <tbody>
          <tr>
            <td
              style={{
                textAlign: 'center',
                padding: 0,
                height: getDimensionValue(data.height ?? DEFAULT_HEIGHT),
              }}
            >
              <a
                className="yaymail-customizer-element-video__anchor"
                href={data.url}
                style={anchorStyle}
              >
                <div
                  className="yaymail-customizer-element-video__thumbnail"
                  style={thumbnailCellStyle}
                >
                  <Play
                    className="yaymail-customizer-element-video__btn-play"
                    style={btnPlayStyle}
                  />
                </div>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const Video = withMemo(VideoContent);

export default Video;
