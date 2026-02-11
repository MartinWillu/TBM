
export async function testCorsApi() {
    const response = await fetch("backend/api/store");
    const json = await response.json();
    console.log(json);
    return json;
}
