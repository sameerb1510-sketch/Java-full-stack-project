export default function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      {(eyebrow || title || description) && <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        {title && <h1>{title}</h1>}
        {description && <p>{description}</p>}
      </div>}
      {action && <div className="heading-action">{action}</div>}
    </div>
  )
}
