import './index.scss';

const GroupDefinition = (props: { title?: string; description?: string }) => {
  return (
    <div className="yaymail-editor-property yaymail-editor-property-group-definition">
      {props.title && (
        <div
          dangerouslySetInnerHTML={{ __html: props.title }}
          className="yaymail-editor-property-group-definition__title"
        ></div>
      )}
      {props.description && (
        <div
          dangerouslySetInnerHTML={{ __html: props.description }}
          className="yaymail-editor-property-group-definition__description"
        ></div>
      )}
    </div>
  );
};

export default GroupDefinition;
