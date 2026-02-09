
export async function testCorsApi() {
    const response = await fetch("backend/api/store");
    const json = response.json();
    console.log(json);
}