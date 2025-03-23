import { rsvp } from "../actions";

export default function RSVPPage() {
    return (
        <div className="container mx-auto p-4">
            <div className="text-center mb-4">
                <h1 className="text-2xl">RSVP</h1>
                <p>We are excited to celebrate with you!</p>
                <p>Please let us know if you can make it.</p>
            </div>
            <form action={rsvp}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input className="border" type="text" id="name" name="name" required />
                </div>

                <div>
                    <label htmlFor="attending">Will you be attending?</label>
                    <input type="checkbox" id="attending" name="attending" defaultChecked />
                </div>

                <button className="border p-2 hover:cursor-pointer" type="submit">Submit</button>
            </form>
        </div>
    );
}