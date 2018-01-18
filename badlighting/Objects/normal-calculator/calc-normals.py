import math

### function block:


# reads Data from a file
def readVertices(path):
    with open(path) as f:
        content = f.readlines()
    content = [x.strip('\n') for x in content]
    content = list(filter(None, content))
    return content


# converts all string elements in list to floats
def convert(content):
    for i in range(len(content)):
        content[i] = float(content[i])


# vertices are represented as a list of 3 elements
# returns a vertex
def subvert(vert1, vert2):
    return [(vert1[0]-vert2[0]),
            (vert1[1]-vert2[1]),
            (vert1
             [2]-vert2[2])]


# vertices represented as lists with 3 elements
# returns a vertex
def cross(vert1, vert2):
    return [(vert1[1] * vert2[2] - vert1[2] * vert2[1]),
            (vert1[2] * vert2[0] - vert1[0] * vert2[2]),
            (vert1[0] * vert2[1] - vert1[1] * vert2[0])]


# distance of a vertice/vector
def distance(vertice):
    return math.sqrt(pow(vertice[0], 2) + pow(vertice[1], 2) + pow(vertice[2], 2))


# normalize function
def normalize(vertice):
    dist = distance(vertice)
    return [(1/dist * vertice[0]), (1/dist * vertice[1]), (1/dist * vertice[2])]


# vertices represented as lists with 3 elements
# returns a vertex-normal
def calcOneNormal(vert1, vert2, vert3):
    u = subvert(vert1, vert2)
    v = subvert(vert1, vert3)
    return cross(u, v)


# calculates all normals for all planes
def calcNormals(vertices):
    normals = []
    i = 0
    while i < len(vertices):
        normals.append(normalize(calcOneNormal([vertices[i], vertices[(i+1)], vertices[(i+2)]],
                                     [vertices[(i+3)], vertices[(i+4)], vertices[(i+5)]],
                                     [vertices[i+6], vertices[(i+7)], vertices[(i+8)]])))
        i = i+9
    return normals


### function block end!

# reading the verticedata:
contentIsland = readVertices("island_2.txt")


# converting the lists to float values
convert(contentIsland)


# open file for saving the data
IslandOutput = open("Island_2_OutputNormals.txt","w")

# writing the normals into the file
for x in calcNormals(contentIsland):
  for y in x:
    IslandOutput.write("%s\n" % y)
