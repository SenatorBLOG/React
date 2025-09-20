export const StatefulContactCard = ({ name, email, phone }) => {
const[detailsVisable, setDetailsVisible] = useState(false)
const toggleDetails = () => {
    setDetailsVisible(!detailsVisable)
};
return (
<div style={{ border: '1px solid #28a745', borderRadius: '8px', padding:
'16px', margin: '16px 0', backgroundColor: '#f8f9fa' }}>
<h2>{name}</h2>
{detailsVisable ? 'Hide Details' : 'Show Details'}
{detailsVisable &&(<div>
    <p>Email: {email}</p>
<p>Phone: {phone}</p>
</div>)}
</div>
);
};
