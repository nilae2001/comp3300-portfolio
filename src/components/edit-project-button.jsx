
import Link from "next/link";
import { Button } from "./ui/button";

export default function EditProjectButton({ id }) {
    return (
        <Button variant="outline" className="p-4 rounded bg-yellow-500 hover:bg-yellow-800">
            <Link href={`/projects/${id}/edit`}>
                ✏️
            </Link>
        </Button>
    );
}